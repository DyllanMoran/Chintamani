const SUPABASE_URL = 'https://enwbflhtxqzufvmurvcl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVud2JmbGh0eHF6dWZ2bXVydmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODY0MTcsImV4cCI6MjA4OTk2MjQxN30.YbjdzGtavPSBR1eoahvVgVw0NMUlbTYfDIdrrQoXilc';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const postList = document.getElementById('post-list');
const postBody = document.getElementById('post-body');
const postAuthor = document.getElementById('post-author');
const postSubmit = document.getElementById('post-submit');

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    + ' at '
    + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function renderPost(post) {
  const div = document.createElement('div');
  div.className = 'post';
  div.dataset.id = post.id;
  div.innerHTML = `
    <p class="post-body">${post.body}</p>
    <span class="post-meta">${post.author} &middot; ${formatDate(post.created_at)}</span>
    <span class="post-actions">
      <button class="post-action" onclick="editPost(${post.id})">edit</button>
      <button class="post-action" onclick="deletePost(${post.id})">delete</button>
    </span>
  `;
  postList.prepend(div);
}

async function loadPosts() {
  const { data, error } = await client
    .from('Posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }
  data.forEach(renderPost);
}

async function submitPost() {
  const body = postBody.value.trim();
  const author = postAuthor.value.trim();

  if (!body || !author) return;

  postSubmit.disabled = true;

  const { data, error } = await client
    .from('Posts')
    .insert([{ body, author }])
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
  const div = document.querySelector(`.post[data-id="${id}"]`);
  if (!div) return;

  const { error } = await client
    .from('Posts')
    .delete()
    .eq('id', id);

  if (error) { console.error(error); return; }
  div.remove();
}

async function editPost(id) {
  const div = document.querySelector(`.post[data-id="${id}"]`);
  if (!div) return;

  const bodyEl = div.querySelector('.post-body');
  const currentText = bodyEl.textContent;

  const textarea = document.createElement('textarea');
  textarea.className = 'edit-textarea';
  textarea.value = currentText;

  const saveBtn = document.createElement('button');
  saveBtn.className = 'post-action';
  saveBtn.textContent = 'save';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'post-action';
  cancelBtn.textContent = 'cancel';

  const editActions = document.createElement('span');
  editActions.className = 'post-actions';
  editActions.appendChild(saveBtn);
  editActions.appendChild(cancelBtn);

  const originalHTML = div.innerHTML;
  bodyEl.replaceWith(textarea);
  div.querySelector('.post-actions').replaceWith(editActions);

  textarea.focus();

  cancelBtn.addEventListener('click', () => {
    div.innerHTML = originalHTML;
  });

  saveBtn.addEventListener('click', async () => {
    const newBody = textarea.value.trim();
    if (!newBody) return;

    const { error } = await client
      .from('Posts')
      .update({ body: newBody })
      .eq('id', id);

    if (error) { console.error(error); return; }

    div.innerHTML = originalHTML;
    div.querySelector('.post-body').textContent = newBody;
  });
}

postSubmit.addEventListener('click', submitPost);

loadPosts();
