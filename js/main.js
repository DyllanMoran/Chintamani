var SUPABASE_URL = 'https://enwbflhtxqzufvmurvcl.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVud2JmbGh0eHF6dWZ2bXVydmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODY0MTcsImV4cCI6MjA4OTk2MjQxN30.YbjdzGtavPSBR1eoahvVgVw0NMUlbTYfDIdrrQoXilc';

var client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

var postList = document.getElementById('post-list');
var postBody = document.getElementById('post-body');
var postSubmit = document.getElementById('post-submit');

function formatDate(dateStr) {
  var date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    + ' at '
    + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function renderPost(post) {
  var div = document.createElement('div');
  div.className = 'post-item';
  div.dataset.id = post.id;
  div.innerHTML =
    '<span class="post-body">' + post.body + '</span> ' +
    '<span class="post-meta">(' + formatDate(post.created_at) +
      ' · <button class="post-actions" onclick="editPost(' + post.id + ')">edit</button>' +
      ' · <button class="post-actions" onclick="deletePost(' + post.id + ')">delete</button>)</span>';
  postList.prepend(div);
}

async function loadPosts() {
  var { data, error } = await client
    .from('Colby')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }
  data.forEach(renderPost);
}

async function submitPost() {
  var body = postBody.value.trim();
  if (!body) return;

  postSubmit.disabled = true;

  var { data, error } = await client
    .from('Colby')
    .insert([{ body: body }])
    .select()
    .single();

  if (error) {
    console.error(error);
    postSubmit.disabled = false;
    return;
  }

  postBody.value = '';
  renderPost(data);
  postSubmit.disabled = false;
}

async function deletePost(id) {
  var div = document.querySelector('.post-item[data-id="' + id + '"]');
  if (!div) return;

  var { error } = await client
    .from('Colby')
    .delete()
    .eq('id', id);

  if (error) { console.error(error); return; }
  div.remove();
}

async function editPost(id) {
  var div = document.querySelector('.post-item[data-id="' + id + '"]');
  if (!div) return;

  var bodyEl = div.querySelector('.post-body');
  var currentText = bodyEl.textContent;
  var originalHTML = div.innerHTML;

  bodyEl.innerHTML = '<span class="edit-inline" contenteditable="true">' + currentText + '</span>';
  var editable = bodyEl.querySelector('.edit-inline');
  editable.focus();

  var meta = div.querySelector('.post-meta');
  meta.innerHTML = '(<button class="post-actions" data-action="save">save</button>' +
    ' · <button class="post-actions" data-action="cancel">cancel</button>)';

  meta.querySelector('[data-action="cancel"]').addEventListener('click', function () {
    div.innerHTML = originalHTML;
  });

  meta.querySelector('[data-action="save"]').addEventListener('click', async function () {
    var newBody = editable.textContent.trim();
    if (!newBody) return;

    var { error } = await client
      .from('Colby')
      .update({ body: newBody })
      .eq('id', id);

    if (error) { console.error(error); return; }

    div.innerHTML = originalHTML;
    div.querySelector('.post-body').textContent = newBody;
  });
}

postSubmit.addEventListener('click', submitPost);

loadPosts();
