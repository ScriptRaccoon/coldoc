# Coldoc

This is a basic collaborative text editor. There is no login, and documents can simply be shared via links.

https://coldoc-xhpa.onrender.com

Since editing texts at the same time by multiple clients seems to be notoriously difficult (see [OT](https://en.wikipedia.org/wiki/Operational_transformation) and [CRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)), I have decided to keep it simple and just allow one editor at a time. When an editor is typing, the others have to wait. Once finished, someone else can continue typing.

## Tech

The tech stack is deliberately simple. The frontend uses no framework at all, it is just Vanilla JavaScript and Vanilla CSS. To render dynamic HTML we use EJS templates. The backend provides an express server and uses mongoose to connect with the MongoDB database. The communication between clients is implemented with socket.io. There is no build step on the frontend or the backend.

## Local development

1. Install the dependencies on the server with `pnpm install` (or `npm install`, etc.).

2. Run the development server `pnpm dev`.
