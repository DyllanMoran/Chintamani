var SUPABASE_URL = 'https://enwbflhtxqzufvmurvcl.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVud2JmbGh0eHF6dWZ2bXVydmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODY0MTcsImV4cCI6MjA4OTk2MjQxN30.YbjdzGtavPSBR1eoahvVgVw0NMUlbTYfDIdrrQoXilc';

var client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

var affirmationList = document.getElementById('affirmation-list');
var affirmationBody = document.getElementById('affirmation-body');
var affirmationSubmit = document.getElementById('affirmation-submit');

function formatDate(dateStr) {
  var date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    + ' at '
    + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function renderAffirmation(entry) {
  var div = document.createElement('div');
  div.className = 'post-item';
  div.dataset.id = entry.id;
  div.innerHTML =
    '<p class="post-body">' + entry.feeling + '</p>' +
    '<div class="post-meta">' +
      '<span>' + formatDate(entry.created_at) + '</span>' +
      '<span class="post-actions">' +
        '<button class="post-actions button" onclick="editAffirmation(' + entry.id + ')">edit</button>' +
        '<button class="post-actions button" onclick="deleteAffirmation(' + entry.id + ')">delete</button>' +
      '</span>' +
    '</div>';
  affirmationList.appendChild(div);
}

async function loadAffirmations() {
  var { data, error } = await client
    .from('This is Real.')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }
  data.forEach(renderAffirmation);
}

async function submitAffirmation() {
  var body = affirmationBody.value.trim();
  if (!body) return;

  affirmationSubmit.disabled = true;

  var { data, error } = await client
    .from('This is Real.')
    .insert([{ feeling: body }])
    .select()
    .single();

  if (error) {
    console.error(error);
    affirmationSubmit.disabled = false;
    return;
  }

  affirmationBody.value = '';
  var newEntry = document.createElement('div');
  newEntry.className = 'post-item';
  newEntry.dataset.id = data.id;
  newEntry.innerHTML =
    '<p class="post-body">' + data.feeling + '</p>' +
    '<div class="post-meta">' +
      '<span>' + formatDate(data.created_at) + '</span>' +
      '<span class="post-actions">' +
        '<button class="post-actions button" onclick="editAffirmation(' + data.id + ')">edit</button>' +
        '<button class="post-actions button" onclick="deleteAffirmation(' + data.id + ')">delete</button>' +
      '</span>' +
    '</div>';
  affirmationList.prepend(newEntry);
  affirmationSubmit.disabled = false;
}

async function deleteAffirmation(id) {
  var div = document.querySelector('.post-item[data-id="' + id + '"]');
  if (!div) return;

  var { error } = await client
    .from('This is Real.')
    .delete()
    .eq('id', id);

  if (error) { console.error(error); return; }
  div.remove();
}

async function editAffirmation(id) {
  var div = document.querySelector('.post-item[data-id="' + id + '"]');
  if (!div) return;

  var bodyEl = div.querySelector('.post-body');
  var currentText = bodyEl.textContent;

  var textarea = document.createElement('textarea');
  textarea.className = 'edit-textarea';
  textarea.value = currentText;

  var saveBtn = document.createElement('button');
  saveBtn.className = 'post-actions button';
  saveBtn.textContent = 'save';

  var cancelBtn = document.createElement('button');
  cancelBtn.className = 'post-actions button';
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
      .from('This is Real.')
      .update({ feeling: newBody })
      .eq('id', id);

    if (error) { console.error(error); return; }

    div.innerHTML = originalHTML;
    div.querySelector('.post-body').textContent = newBody;
  });
}

affirmationSubmit.addEventListener('click', submitAffirmation);

loadAffirmations();
