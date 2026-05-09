export async function onRequest(context) {
  const { request, env } = context;
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  try {
    switch (request.method) {
      case 'GET': {
        if (id) {
          const row = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
          if (!row) {
            return jsonResponse({ error: '产品不存在' }, 404, corsHeaders);
          }
          row.hot = !!row.hot;
          row.variants = parseVariants(row.variants);
          return jsonResponse(row, 200, corsHeaders);
        }
        const { results } = await env.DB.prepare('SELECT * FROM products ORDER BY id DESC').all();
        results.forEach(r => {
          r.hot = !!r.hot;
          r.variants = parseVariants(r.variants);
        });
        return jsonResponse(results, 200, corsHeaders);
      }

      case 'POST': {
        const body = await request.json();
        const { name, brand, category, image, image_data, price, spec, desc, hot, variants } = body;
        if (!name) {
          return jsonResponse({ error: '产品名称不能为空' }, 400, corsHeaders);
        }
        const variantsStr = JSON.stringify(variants || []);
        const result = await env.DB.prepare(
          'INSERT INTO products (name, brand, category, image, image_data, price, spec, desc, hot, variants) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(name, brand || '', category || '', image || '', image_data || '', price || '面议', spec || '', desc || '', hot ? 1 : 0, variantsStr).run();
        return jsonResponse({ id: result.meta.last_row_id, ...body, hot: !!hot, variants: variants || [] }, 201, corsHeaders);
      }

      case 'PUT': {
        const body = await request.json();
        const { id: bodyId, name, brand, category, image, image_data, price, spec, desc, hot, variants } = body;
        const targetId = bodyId || id;
        if (!targetId) {
          return jsonResponse({ error: '缺少产品ID' }, 400, corsHeaders);
        }
        if (!name) {
          return jsonResponse({ error: '产品名称不能为空' }, 400, corsHeaders);
        }
        const variantsStr = JSON.stringify(variants || []);
        await env.DB.prepare(
          "UPDATE products SET name=?, brand=?, category=?, image=?, image_data=?, price=?, spec=?, desc=?, hot=?, variants=?, updated_at=datetime('now', '+8 hours') WHERE id=?"
        ).bind(name, brand || '', category || '', image || '', image_data || '', price || '面议', spec || '', desc || '', hot ? 1 : 0, variantsStr, targetId).run();
        return jsonResponse({ id: parseInt(targetId), ...body, hot: !!hot, variants: variants || [] }, 200, corsHeaders);
      }

      case 'DELETE': {
        const deleteId = id || (await request.json()).id;
        if (!deleteId) {
          return jsonResponse({ error: '缺少产品ID' }, 400, corsHeaders);
        }
        await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(deleteId).run();
        return jsonResponse({ success: true }, 200, corsHeaders);
      }

      default:
        return jsonResponse({ error: '不支持的请求方法' }, 405, corsHeaders);
    }
  } catch (err) {
    return jsonResponse({ error: err.message }, 500, corsHeaders);
  }
}

function parseVariants(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string' && v) {
    try { return JSON.parse(v); } catch { return []; }
  }
  return [];
}

function jsonResponse(data, status, corsHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}
