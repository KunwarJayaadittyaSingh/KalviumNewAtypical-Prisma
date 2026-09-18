// ─────────────────────────────────────────────────────────────
import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

// GET /api/threads — return the whole list.
router.get("/", async (req, res, next) => {
  try {
    const threads = await prisma.thread.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(threads);
  } catch (error) {
    next(error);
  }
});

// POST /api/threads — create a thread from { title, body }.
router.post("/", async (req, res, next) => {
  try {
    const { title, body = "" } = req.body || {};
    const thread = await prisma.thread.create({
      data: { title, body },
    });
    res.status(201).json(thread);
  } catch (error) {
    next(error);
  }
});

// PUT /api/threads/:id — update title/body of one thread.
router.put("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, body } = req.body || {};

    const data = {};
    if (title !== undefined) data.title = title;
    if (body !== undefined) data.body = body;

    const thread = await prisma.thread.update({
      where: { id },
      data,
    });
    res.status(200).json(thread);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Thread not found." });
    }
    next(error);
  }
});

// DELETE /api/threads/:id — remove one thread, return the deleted record.
router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const thread = await prisma.thread.delete({
      where: { id },
    });
    res.status(200).json(thread);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Thread not found." });
    }
    next(error);
  }
});

export default router;