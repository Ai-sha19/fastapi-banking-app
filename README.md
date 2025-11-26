# Banking UI Frontend

This is a **Next.js + TailwindCSS frontend** for a FastAPI banking backend.

## Project Context

- Backend API (already running at [http://localhost:8000](http://localhost:8000)):
  - `POST /authenticate` → body: `{ name, pin_number }` → returns `{ message, bank_balance }`
  - `POST /bank-transfer` → body: `{ sender_name, receiver_name, amount }` → returns `{ sender_balance, receiver_balance }`
- **Do not modify any existing backend files (`main.py`) or other folders/files.**
- Frontend will be generated in a new folder named `banking-ui`.

## Frontend Requirements

1. **Project Scaffold**
   - `banking-ui` folder with `package.json`
   - Next.js pages
   - TailwindCSS configured (`postcss + tailwindcss init`)
   - Do **not** use React Compiler (ignore any CLI prompts regarding React Compiler)

2. **pages/index.js**
   - Single-page UI with three components:
     - **Login Form:** inputs `name` and `pin_number`; calls `POST /authenticate`; saves `currentUser { name, bank_balance }` in state
     - **AccountView:** shows `currentUser.name` and `bank_balance`
     - **Transfer Form:** inputs `receiver_name` and `amount`; on submit calls `POST /bank-transfer` with `sender_name = currentUser.name`; updates `currentUser.bank_balance`
     - After successful transfer, automatically call `POST /authenticate` for the receiver to show updated balance below (receiver name + balance)

3. **lib/api.js**
   - Helper functions:
     - `authenticate(name, pin)` → fetch `/authenticate`
     - `bankTransfer(sender, receiver, amount)` → fetch `/bank-transfer`

4. **UX & Validation**
   - Disable submit while requests pending
   - Show inline error messages
   - Validate `amount > 0` and `amount <= sender balance`
   - All fields required

5. **Styling & Color Theme**
   - Professional, warm financial theme:
     - Background gradient: top-left `#F0A730` → bottom-right `#9E6726`
     - White text on dark gradient for focus
     - Black text on light UI components for readability
   - Responsive layout:
     - Desktop: Login top-left, Transfer top-right
     - Mobile: stacked vertically
   - Minimal Tailwind classes
   - Gradient can be implemented using `bg-[linear-gradient(to_bottom_right,_#F0A730,_#9E6726)]` or extended Tailwind config

6. **README Instructions**
   - Commands:
     ```bash
     npm install
     npm run dev
     ```
   - Backend run:
     ```bash
     uvicorn main:app --reload --port 8000
     ```
   - Optional debug hint: add `GET /users` route temporarily for debugging
   - Optional CORS snippet instruction

7. **Other Notes**
   - Keep everything beginner-friendly and copy-paste ready
   - Commit all generated files
   - Show file tree at the end
   - Return full project as list of files with contents + one command to run the frontend
