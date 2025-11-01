# ClickUp Clone - CRUD Documentation

## ✅ PROJECTS CRUD - COMPLETED

### Backend API Endpoints (`/api/projects`)

#### 1. **GET /api/projects** - Get All Projects
- ✅ Menampilkan semua project yang user miliki atau jadi member
- ✅ Include: owner, members, task count, document count
- ✅ Sorted by createdAt descending

#### 2. **GET /api/projects/:id** - Get Single Project
- ✅ Menampilkan detail project beserta tasks
- ✅ Include: owner, members dengan user info, tasks dengan assignee
- ✅ Permission: owner atau member

#### 3. **POST /api/projects** - Create Project
- ✅ Membuat project baru
- ✅ Fields: name, description, color
- ✅ Auto-assign creator sebagai OWNER member
- ✅ Return: project dengan owner dan members

#### 4. **PUT /api/projects/:id** - Update Project
- ✅ Update nama, deskripsi, dan warna project
- ✅ Permission: hanya owner yang bisa update
- ✅ Validation: project harus ada dan user adalah owner

#### 5. **DELETE /api/projects/:id** - Delete Project
- ✅ Hapus project (cascade delete tasks, documents, members)
- ✅ Permission: hanya owner yang bisa delete
- ✅ Confirmation required di frontend

#### 6. **POST /api/projects/:id/members** - Add Member
- ✅ Tambah member ke project via email
- ✅ Permission: owner atau admin
- ✅ Validation: user exists, not already member
- ✅ Fields: email, role (ADMIN/MEMBER/VIEWER)

#### 7. **DELETE /api/projects/:id/members/:userId** - Remove Member
- ✅ Hapus member dari project
- ✅ Permission: owner atau admin
- ✅ Validation: cannot remove owner

#### 8. **PATCH /api/projects/:id/members/:userId** - Update Member Role
- ✅ Update role member (ADMIN/MEMBER/VIEWER)
- ✅ Permission: owner atau admin
- ✅ Validation: cannot change owner role

### Frontend Features (`/projects`)

#### Projects List Page
- ✅ **Read**: Grid layout dengan semua projects
- ✅ **Create**: Modal untuk create new project
  - Input: name (required), description, color picker
  - Toast notification on success/error
- ✅ **Update**: Three-dot menu untuk edit project
  - Opens modal dengan pre-filled data
  - Save button becomes "Update Project"
- ✅ **Delete**: Three-dot menu untuk delete project
  - Confirmation dialog before delete
  - Toast notification on success/error
- ✅ Empty state dengan ilustrasi dan CTA
- ✅ Real-time updates dengan React Query

#### Project Detail Page (`/projects/:id`)
- ✅ View project details
- ✅ Manage tasks (separate CRUD)
- ✅ Manage members dengan role-based actions
- ✅ Tab switching: Tasks / Team

---

## ✅ DOCUMENTS CRUD - COMPLETED

### Backend API Endpoints (`/api/documents`)

#### 1. **GET /api/documents** - Get All Documents
- ✅ Menampilkan dokumen dari projects yang accessible
- ✅ Query param: ?projectId untuk filter by project
- ✅ Include: creator, project info
- ✅ Sorted by updatedAt descending

#### 2. **GET /api/documents/:id** - Get Single Document
- ✅ Menampilkan detail dokumen
- ✅ Include: creator, project
- ✅ Permission: project member

#### 3. **POST /api/documents** - Create Document
- ✅ Membuat dokumen baru
- ✅ Fields: title (required), content, projectId (required)
- ✅ Permission: project member (not VIEWER)
- ✅ Validation: project exists, user has access

#### 4. **PUT /api/documents/:id** - Update Document
- ✅ Update title dan/atau content
- ✅ Permission: project member (not VIEWER)
- ✅ Validation: document exists, user has edit permission
- ✅ Auto-update updatedAt timestamp

#### 5. **DELETE /api/documents/:id** - Delete Document
- ✅ Hapus dokumen
- ✅ Permission: creator, project owner, atau admin
- ✅ Confirmation required di frontend

### Frontend Features

#### Documents List Page (`/documents`)
- ✅ **Read**: Grid layout dengan semua documents
- ✅ **Create**: Modal untuk create new document
  - Input: title (required), project (dropdown), content (optional)
  - Redirect ke editor setelah create
- ✅ **Delete**: Trash icon pada hover
  - Confirmation dialog
  - Toast notification
- ✅ Empty state dengan ilustrasi
- ✅ Real-time updates dengan React Query

#### Document Editor (`/documents/:id`)
- ✅ **Read**: Load document content
- ✅ **Update**: Real-time editing dengan auto-save
  - Large textarea editor
  - Character & word count
  - Auto-save every 30 seconds
  - Manual save button dengan disabled state
  - "Unsaved changes" indicator
  - Toast notification on save
- ✅ Metadata display: creator, last updated, project badge
- ✅ Back navigation ke documents list

---

## 🔐 PERMISSION SYSTEM

### Project Roles
- **OWNER**: Full control (create, update, delete project, manage all members)
- **ADMIN**: Manage members, create/edit/delete tasks & documents
- **MEMBER**: Create/edit/delete own tasks & documents
- **VIEWER**: Read-only access

### Document Permissions
- **Create**: Project members (not VIEWER)
- **Read**: All project members
- **Update**: Project members (not VIEWER)
- **Delete**: Creator, Project Owner, or Admin

---

## 🎯 FEATURES IMPLEMENTED

### UI/UX Features
✅ Modal forms dengan validation
✅ Confirmation dialogs untuk delete actions
✅ Toast notifications (success/error)
✅ Loading states
✅ Empty states dengan illustrations
✅ Hover effects dan transitions
✅ Three-dot menu untuk actions
✅ Color picker untuk projects
✅ Auto-save untuk documents (30s interval)
✅ Character & word count
✅ Unsaved changes indicator

### Technical Features
✅ React Query untuk data fetching & caching
✅ Optimistic updates
✅ Error handling
✅ Type-safe dengan TypeScript
✅ Prisma ORM untuk database
✅ JWT authentication
✅ Role-based permissions
✅ Cascade delete (project → tasks, documents, members)

---

## 📝 USAGE EXAMPLES

### Create Project
```typescript
// POST /api/projects
{
  "name": "Website Redesign",
  "description": "Redesign company website",
  "color": "#10b981"
}
```

### Update Project
```typescript
// PUT /api/projects/:id
{
  "name": "Website Redesign v2",
  "description": "Updated description",
  "color": "#3b82f6"
}
```

### Create Document
```typescript
// POST /api/documents
{
  "title": "Meeting Notes - Jan 2025",
  "content": "## Agenda\n\n1. Project updates\n2. Next steps",
  "projectId": "project-uuid-here"
}
```

### Update Document
```typescript
// PUT /api/documents/:id
{
  "title": "Meeting Notes - Jan 2025 (Updated)",
  "content": "Updated content here..."
}
```

---

## 🧪 TESTING CHECKLIST

### Projects
- [x] Create project dengan validasi
- [x] Read all projects
- [x] Read single project dengan tasks & members
- [x] Update project (nama, deskripsi, warna)
- [x] Delete project dengan confirmation
- [x] Add member via email
- [x] Remove member
- [x] Update member role
- [x] Permission checks (owner only untuk sensitive actions)

### Documents
- [x] Create document dengan project selection
- [x] Read all documents
- [x] Read single document
- [x] Update document (manual save)
- [x] Update document (auto-save 30s)
- [x] Delete document dengan confirmation
- [x] Permission checks (not VIEWER untuk edit)
- [x] Word & character count
- [x] Unsaved changes indicator

---

## 🚀 NEXT STEPS (Optional Enhancements)

### Projects
- [ ] Duplicate project
- [ ] Archive project
- [ ] Project templates
- [ ] Project favorites
- [ ] Search & filter projects
- [ ] Sort projects (name, date, tasks count)

### Documents
- [ ] Rich text editor (Bold, Italic, Lists, etc.)
- [ ] Document versioning
- [ ] Collaborative editing (real-time dengan Socket.io)
- [ ] Document comments
- [ ] Document sharing (public link)
- [ ] Export to PDF/Markdown
- [ ] Search documents
- [ ] Document templates

### General
- [ ] Drag & drop reordering
- [ ] Bulk actions (select multiple, delete multiple)
- [ ] Activity log (who did what, when)
- [ ] Email notifications
- [ ] Mobile responsive optimization

---

## 📚 API DOCUMENTATION

Semua endpoints memerlukan Authentication header:
```
Authorization: Bearer <jwt_token>
```

Base URL: `http://localhost:5000/api`

### Response Format
Success:
```json
{
  "id": "uuid",
  "name": "Project Name",
  ...
}
```

Error:
```json
{
  "message": "Error description"
}
```

---

## 🎉 SUMMARY

**Projects CRUD**: ✅ COMPLETE
- Create, Read, Update, Delete
- Member management (Add, Remove, Update Role)
- Full permission system

**Documents CRUD**: ✅ COMPLETE
- Create, Read, Update, Delete
- Auto-save functionality
- Rich editing experience

**Total API Endpoints**: 13
**Total Frontend Pages**: 4
**Total Lines of Code**: ~2000+

Semua fungsionalitas CRUD untuk Projects dan Documents sudah lengkap dan siap digunakan! 🚀
