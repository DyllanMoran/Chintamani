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
  div.className = 'post';
  div.dataset.id = post.id;
  div.innerHTML =
    '<p class="post-body">' + post.body + '</p>' +
    '<span class="post-meta">' + formatDate(post.created_at) + '</span>' +
    '<span class="post-actions">' +
      '<button class="post-action" onclick="editPost(' + post.id + ')">edit</button>' +
      '<button class="post-action" onclick="deletePost(' + post.id + ')">delete</button>' +
    '</span>';
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
  var div = document.querySelector('.post[data-id="' + id + '"]');
  if (!div) return;

  var { error } = await client
    .from('Colby')
    .delete()
    .eq('id', id);

  if (error) { console.error(error); return; }
  div.remove();
}

async function editPost(id) {
  var div = document.querySelector('.post[data-id="' + id + '"]');
  if (!div) return;

  var bodyEl = div.querySelector('.post-body');
  var currentText = bodyEl.textContent;

  var textarea = document.createElement('textarea');
  textarea.className = 'edit-textarea';
  textarea.value = currentText;

  var saveBtn = document.createElement('button');
  saveBtn.className = 'post-action';
  saveBtn.textContent = 'save';

  var cancelBtn = document.createElement('button');
  cancelBtn.className = 'post-action';
  cancelBtn.textContent = 'cancel';

  var editActions = document.createElement('span');
  editActions.className = 'post-actions';
  editActions.appendChild(saveBtn);
  editActions.appendChild(cancelBtn);

  var originalHTML = div.innerHTML;
  bodyEl.replaceWith(textarea);
  div.querySelector('.post-actions').replaceWith(editActions);

  textarea.focus();

  cancelBtn.addEventListener('click', function () {
    div.innerHTML = originalHTML;
  });

  saveBtn.addEventListener('click', async function () {
    var newBody = textarea.value.trim();
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
