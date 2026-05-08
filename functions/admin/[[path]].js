export async function onRequest(context) {
  const adminHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>商品管理 - 领航印刷机零件商城</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F5F3EF; color: #1A1D23; min-height: 100vh; }
.header { background: #1A1D23; color: #fff; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; }
.header h1 { font-size: 18px; font-weight: 600; }
.header a { color: #B87333; text-decoration: none; font-size: 14px; }
.container { max-width: 960px; margin: 0 auto; padding: 20px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.btn { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; }
.btn-primary { background: #B87333; color: #fff; }
.btn-primary:hover { background: #8B5A2B; }
.btn-danger { background: #C44B4B; color: #fff; }
.btn-danger:hover { background: #a03a3a; }
.btn-ghost { background: transparent; color: #B87333; border: 1px solid #B87333; }
.btn-ghost:hover { background: rgba(184,115,51,0.1); }
.btn-sm { padding: 4px 10px; font-size: 12px; }
.count { font-size: 14px; color: #666; }
.table-wrap { background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
table { width: 100%; border-collapse: collapse; }
th { background: #f8f7f5; text-align: left; padding: 12px 16px; font-size: 13px; color: #666; font-weight: 500; border-bottom: 1px solid #eee; }
td { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover { background: #fafaf8; }
.tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.tag-brand { background: rgba(184,115,51,0.1); color: #B87333; }
.tag-category { background: rgba(74,139,107,0.1); color: #4A8B6B; }
.tag-hot { background: rgba(196,75,75,0.1); color: #C44B4B; }
.actions { display: flex; gap: 6px; }
.img-thumb { width: 40px; height: 40px; border-radius: 6px; object-fit: cover; background: #f0f0f0; }
.empty { text-align: center; padding: 60px 20px; color: #999; }
.empty p { margin-top: 8px; font-size: 14px; }
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; align-items: flex-end; justify-content: center; overflow-y: auto; -webkit-overflow-scrolling: touch; }
.modal-overlay.active { display: flex; }
.modal { background: #fff; border-radius: 12px 12px 0 0; width: 100%; max-width: 520px; max-height: 92vh; display: flex; flex-direction: column; margin-top: auto; }
.modal-header { padding: 16px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
.modal-header h2 { font-size: 16px; }
.modal-close { background: none; border: none; font-size: 20px; cursor: pointer; color: #999; padding: 4px; }
.modal-body { padding: 20px; overflow-y: auto; flex: 1; -webkit-overflow-scrolling: touch; }
.form-group { margin-bottom: 14px; }
.form-group label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 4px; color: #333; }
.form-group input, .form-group textarea, .form-group select { width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; font-family: inherit; }
.form-group textarea { resize: vertical; min-height: 60px; }
.form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #B87333; box-shadow: 0 0 0 3px rgba(184,115,51,0.1); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.checkbox-label { display: flex; align-items: center; gap: 6px; font-size: 14px; cursor: pointer; }
.checkbox-label input { width: auto; }
.modal-footer { padding: 12px 20px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 8px; flex-shrink: 0; padding-bottom: calc(12px + env(safe-area-inset-bottom)); }
.toast { position: fixed; top: 20px; right: 20px; background: #1A1D23; color: #fff; padding: 10px 20px; border-radius: 8px; font-size: 14px; z-index: 200; opacity: 0; transition: opacity 0.3s; pointer-events: none; }
.toast.show { opacity: 1; }
.upload-area { border: 2px dashed #ddd; border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; min-height: 100px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.upload-area:hover { border-color: #B87333; background: rgba(184,115,51,0.03); }
.upload-area.has-image { padding: 0; border-style: solid; border-color: #B87333; }
.upload-area input { display: none; }
.upload-hint { font-size: 13px; color: #999; }
.upload-hint span { color: #B87333; }
.upload-preview { width: 100%; max-height: 200px; object-fit: contain; border-radius: 6px; }
.upload-actions { position: absolute; top: 6px; right: 6px; display: flex; gap: 4px; }
.upload-actions button { background: rgba(0,0,0,0.6); color: #fff; border: none; border-radius: 4px; padding: 2px 8px; font-size: 12px; cursor: pointer; }
.upload-size { font-size: 11px; color: #999; margin-top: 4px; }
@media (max-width: 640px) {
  .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  table { min-width: 700px; }
  .container { padding: 12px; }
  .toolbar { flex-wrap: wrap; gap: 8px; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
</head>
<body>
<div class="header">
  <h1>商品管理</h1>
  <a href="/">← 返回商城</a>
</div>
<div class="container">
  <div class="toolbar">
    <span class="count" id="count">加载中...</span>
    <button class="btn btn-primary" onclick="openAdd()">+ 添加商品</button>
  </div>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>图片</th>
          <th>名称</th>
          <th>品牌</th>
          <th>分类</th>
          <th>规格</th>
          <th>价格</th>
          <th>热门</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody id="tbody"></tbody>
    </table>
    <div class="empty" id="empty" style="display:none">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/></svg>
      <p>暂无商品，点击上方按钮添加</p>
    </div>
  </div>
</div>

<div class="modal-overlay" id="modal">
  <div class="modal">
    <div class="modal-header">
      <h2 id="modalTitle">添加商品</h2>
      <button class="modal-close" onclick="closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <input type="hidden" id="f_id">
      <div class="form-group">
        <label>产品图片</label>
        <div class="upload-area" id="uploadArea" onclick="document.getElementById('f_file').click()">
          <input type="file" id="f_file" accept="image/*" onchange="onFileChange(event)">
          <div class="upload-hint" id="uploadHint"><span>点击上传图片</span><br>支持 JPG、PNG、GIF</div>
          <img class="upload-preview" id="uploadPreview" style="display:none">
          <div class="upload-actions" id="uploadActions" style="display:none">
            <button onclick="event.stopPropagation(); removeImage()">删除</button>
          </div>
        </div>
        <div class="upload-size" id="uploadSize"></div>
      </div>
      <div class="form-group">
        <label>产品名称 *</label>
        <input type="text" id="f_name" placeholder="如：胶辊">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>品牌</label>
          <select id="f_brand">
            <option value="">请选择</option>
            <option value="海德堡">海德堡</option>
            <option value="小森">小森</option>
            <option value="罗兰">罗兰</option>
          </select>
        </div>
        <div class="form-group">
          <label>分类</label>
          <input type="text" id="f_category" placeholder="如：易损件">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>价格</label>
          <input type="text" id="f_price" placeholder="面议" value="面议">
        </div>
        <div class="form-group">
          <label>规格</label>
          <input type="text" id="f_spec" placeholder="如：直径80mm，适用SM系列">
        </div>
      </div>
      <div class="form-group">
        <label>产品描述</label>
        <textarea id="f_desc" placeholder="产品详细介绍"></textarea>
      </div>
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" id="f_hot"> 设为热门推荐
        </label>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">取消</button>
      <button class="btn btn-primary" onclick="saveProduct()">保存</button>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
const API = '/api/products';
let products = [];
let currentImageData = '';

function getProductImage(p) {
  if (p.image_data && p.image_data.startsWith('data:')) return p.image_data;
  if (p.image) return p.image;
  return '';
}

async function loadProducts() {
  try {
    const res = await fetch(API);
    products = await res.json();
    render();
  } catch (e) {
    toast('加载失败: ' + e.message);
  }
}

function render() {
  const tbody = document.getElementById('tbody');
  const empty = document.getElementById('empty');
  document.getElementById('count').textContent = '共 ' + products.length + ' 件商品';
  if (products.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  tbody.innerHTML = products.map(p => {
    const imgSrc = getProductImage(p);
    const imgHtml = imgSrc ? '<img class="img-thumb" src="' + esc(imgSrc) + '" onerror="this.style.display=\\'none\\'">' : '-';
    return '<tr>' +
      '<td>' + imgHtml + '</td>' +
      '<td><strong>' + esc(p.name) + '</strong></td>' +
      '<td><span class="tag tag-brand">' + esc(p.brand) + '</span></td>' +
      '<td><span class="tag tag-category">' + esc(p.category) + '</span></td>' +
      '<td style="font-size:12px;color:#666">' + esc(p.spec) + '</td>' +
      '<td>' + esc(p.price) + '</td>' +
      '<td>' + (p.hot ? '<span class="tag tag-hot">热门</span>' : '-') + '</td>' +
      '<td class="actions">' +
        '<button class="btn btn-ghost btn-sm" onclick="openEdit(' + p.id + ')">编辑</button>' +
        '<button class="btn btn-danger btn-sm" onclick="deleteProduct(' + p.id + ')">删除</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

function esc(s) { if (!s) return ''; const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    currentImageData = ev.target.result;
    showPreview(currentImageData, file.size);
  };
  reader.readAsDataURL(file);
}

function showPreview(src, size) {
  const area = document.getElementById('uploadArea');
  const preview = document.getElementById('uploadPreview');
  const hint = document.getElementById('uploadHint');
  const actions = document.getElementById('uploadActions');
  const sizeEl = document.getElementById('uploadSize');
  area.classList.add('has-image');
  preview.src = src;
  preview.style.display = 'block';
  hint.style.display = 'none';
  actions.style.display = 'flex';
  if (size) sizeEl.textContent = '文件大小: ' + (size / 1024).toFixed(1) + 'KB';
}

function removeImage() {
  currentImageData = '';
  document.getElementById('f_file').value = '';
  document.getElementById('uploadArea').classList.remove('has-image');
  document.getElementById('uploadPreview').style.display = 'none';
  document.getElementById('uploadHint').style.display = 'block';
  document.getElementById('uploadActions').style.display = 'none';
  document.getElementById('uploadSize').textContent = '';
}

function openAdd() {
  document.getElementById('modalTitle').textContent = '添加商品';
  document.getElementById('f_id').value = '';
  document.getElementById('f_name').value = '';
  document.getElementById('f_brand').value = '';
  document.getElementById('f_category').value = '';
  document.getElementById('f_price').value = '面议';
  document.getElementById('f_spec').value = '';
  document.getElementById('f_desc').value = '';
  document.getElementById('f_hot').checked = false;
  removeImage();
  document.getElementById('modal').classList.add('active');
}

function openEdit(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  document.getElementById('modalTitle').textContent = '编辑商品';
  document.getElementById('f_id').value = p.id;
  document.getElementById('f_name').value = p.name;
  document.getElementById('f_brand').value = p.brand;
  document.getElementById('f_category').value = p.category;
  document.getElementById('f_price').value = p.price;
  document.getElementById('f_spec').value = p.spec;
  document.getElementById('f_desc').value = p.desc;
  document.getElementById('f_hot').checked = p.hot;
  removeImage();
  const imgSrc = getProductImage(p);
  if (imgSrc) {
    currentImageData = p.image_data || '';
    showPreview(imgSrc, null);
    document.getElementById('uploadSize').textContent = currentImageData ? '当前已有上传图片' : '当前使用链接图片: ' + p.image;
  }
  document.getElementById('modal').classList.add('active');
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

async function saveProduct() {
  const id = document.getElementById('f_id').value;
  const data = {
    name: document.getElementById('f_name').value.trim(),
    brand: document.getElementById('f_brand').value,
    category: document.getElementById('f_category').value.trim(),
    price: document.getElementById('f_price').value.trim() || '面议',
    image: '',
    image_data: currentImageData,
    spec: document.getElementById('f_spec').value.trim(),
    desc: document.getElementById('f_desc').value.trim(),
    hot: document.getElementById('f_hot').checked,
  };
  if (!data.name) { toast('请输入产品名称'); return; }
  try {
    if (id) {
      data.id = parseInt(id);
      const old = products.find(p => p.id === parseInt(id));
      if (old && !currentImageData && !data.image_data) {
        data.image = old.image || '';
        data.image_data = old.image_data || '';
      }
      await fetch(API, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      toast('修改成功');
    } else {
      await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      toast('添加成功');
    }
    closeModal();
    loadProducts();
  } catch (e) {
    toast('保存失败: ' + e.message);
  }
}

async function deleteProduct(id) {
  if (!confirm('确定删除这个商品吗？')) return;
  try {
    await fetch(API + '?id=' + id, { method: 'DELETE' });
    toast('删除成功');
    loadProducts();
  } catch (e) {
    toast('删除失败: ' + e.message);
  }
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2000);
}

document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

loadProducts();
</script>
</body>
</html>`;

  return new Response(adminHtml, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
