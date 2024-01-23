# Coldoc

This is a basic collaborative text editor.

https://coldoc-xhpa.onrender.com

The tech stack is deliberately simple. The frontend uses no framework at all. There is no build step on either side.

Since editing texts at the same time by multiple clients seems to be notoriously difficult (see [OT](https://en.wikipedia.org/wiki/Operational_transformation) and [CRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)), I have decided to keep it simple and just allow one editor at a time. When an editor is typing, the others have to wait. When they are finished, someone else can continue typing.

## Local development

1. Install the dependencies with `pnpm install`. If you use `npm`, the command is `npm install`, etc.

2. Run the server with `pnpm start`.

3. To let the server automatically restart upon changes, use `pnpm dev`.
