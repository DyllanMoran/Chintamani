import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

type Post = {
  id: number
  body: string
  created_at: string
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return (
    date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) +
    ' at ' +
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  )
}

const PHOTOS = [
  '/images/colby/20210425_123930_Original.jpeg',
  '/images/colby/20220127_110013_Original.jpeg',
  '/images/colby/20210427_211938_Original.jpeg',
  '/images/colby/IMG_3859.jpeg',
]

export default function Colby() {
  const [posts, setPosts] = useState<Post[]>([])
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editBody, setEditBody] = useState('')

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    if (!supabase) return
    const { data, error } = await supabase
      .from('Colby')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) { console.error(error); return }
    setPosts(data as Post[])
  }

  async function submitPost() {
    if (!supabase) return
    const trimmed = body.trim()
    if (!trimmed) return
    setSubmitting(true)
    const { data, error } = await supabase
      .from('Colby')
      .insert([{ body: trimmed }])
      .select()
      .single()
    if (error) { console.error(error); setSubmitting(false); return }
    setPosts(prev => [data as Post, ...prev])
    setBody('')
    setSubmitting(false)
  }

  async function deletePost(id: number) {
    if (!supabase) return
    const { error } = await supabase.from('Colby').delete().eq('id', id)
    if (error) { console.error(error); return }
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  function startEdit(post: Post) {
    setEditingId(post.id)
    setEditBody(post.body)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditBody('')
  }

  async function saveEdit(id: number) {
    if (!supabase) return
    const trimmed = editBody.trim()
    if (!trimmed) return
    const { error } = await supabase.from('Colby').update({ body: trimmed }).eq('id', id)
    if (error) { console.error(error); return }
    setPosts(prev => prev.map(p => p.id === id ? { ...p, body: trimmed } : p))
    setEditingId(null)
    setEditBody('')
  }

  return (
    <main>
      <section className="hero">
        <h1>Colby</h1>
        <p className="subtitle">
          Memory believes before knowing remembers.<br />
          Believes longer than recollects, longer than knowing even wonders.
        </p>
      </section>

      <section id="photos">
        <div className="photo-grid">
          {PHOTOS.map(src => (
            <img key={src} src={src} alt="" />
          ))}
        </div>
      </section>

      <section id="posts">
        <p className="section-label">
          He's on my mind.<br />
          Maybe this will give those thoughts and feelings a place to go.
        </p>

        <div className="post-form">
          <textarea
            id="post-body"
            placeholder="Write something..."
            value={body}
            onChange={e => setBody(e.target.value)}
          />
          <div className="post-form-footer">
            <button id="post-submit" disabled={submitting} onClick={submitPost}>
              Post
            </button>
          </div>
        </div>

        <div className="post-list">
          {posts.map(post => (
            <div key={post.id} className="post">
              {editingId === post.id ? (
                <>
                  <textarea
                    className="edit-textarea"
                    value={editBody}
                    onChange={e => setEditBody(e.target.value)}
                  />
                  <span className="post-actions">
                    <button className="post-action" onClick={() => saveEdit(post.id)}>save</button>
                    <button className="post-action" onClick={cancelEdit}>cancel</button>
                  </span>
                </>
              ) : (
                <>
                  <p className="post-body">{post.body}</p>
                  <span className="post-meta">
                    {formatDate(post.created_at)}
                  </span>
                  <span className="post-actions">
                    <button className="post-action" onClick={() => startEdit(post)}>edit</button>
                    <button className="post-action" onClick={() => deletePost(post.id)}>delete</button>
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
