// ─────────────────────────────────────────────────────────────
// routes/threads.js
//
// These four handlers STILL use an in-memory array — restart the server and
// every thread is gone. Prisma is already connected (see server.js and
// prisma/client.js). YOUR TASK: replace each handler with a real Prisma query.
//
// Rules for every route:
//   • make the handler  async  and  await  the Prisma call
//   • wrap the body in  try/catch  and call  next(error)  on failure
//   • in write routes, convert the id:  parseInt(req.params.id)
//   • for create/update, pass an explicit  data  object — never  data: req.body
//
// When you are done, NO handler should reference the `threads` array below.
// ─────────────────────────────────────────────────────────────
import { Router } from "express";
import prisma from "../prisma/client.js"; // the singleton — already imported for you

const router = Router();

// ⚠️ Delete this in-memory store once all four routes use Prisma.
let nextId = 4;
let threads = [
  { id: 1, title: "Welcome to Threadbase", body: "Restart the server and I disappear.", createdAt: 1 },
  { id: 2, title: "Swap me to Prisma", body: "Replace these handlers with prisma.thread.* calls.", createdAt: 2 },
  { id: 3, title: "Then I will persist", body: "A real row survives a restart.", createdAt: 3 },
];

// GET /api/threads — return the whole list.
// TODO: replace with  await prisma.thread.findMany()
router.get("/", (req, res) => {
  res.json([...threads].sort((a, b) => b.createdAt - a.createdAt));
});

// POST /api/threads — create a thread from { title, body }.
// TODO: replace with  await prisma.thread.create({ data: { title, body } })  → 201
router.post("/", (req, res) => {
  const { title, body = "" } = req.body || {};
  const thread = { id: nextId++, title, body, createdAt: Date.now() };
  threads.push(thread);
  res.status(201).json(thread);
});

// PUT /api/threads/:id — update title/body of one thread.
// TODO: replace with  await prisma.thread.update({ where: { id: parseInt(...) }, data })
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const thread = threads.find((t) => t.id === id);
  if (!thread) return res.status(404).json({ error: "Thread not found." });
  const { title, body } = req.body || {};
  if (title !== undefined) thread.title = title;
  if (body !== undefined) thread.body = body;
  res.status(200).json(thread);
});

// DELETE /api/threads/:id — remove one thread.
// TODO: replace with  await prisma.thread.delete({ where: { id: parseInt(...) } })
//       return 200 with the deleted record (this course's convention).
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = threads.length;
  threads = threads.filter((t) => t.id !== id);
  if (threads.length === before) return res.status(404).json({ error: "Thread not found." });
  res.status(200).json({ ok: true });
});

export default router;
