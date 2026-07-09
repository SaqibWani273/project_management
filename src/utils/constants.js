export const UserRolesEnum={
  ADMIN:'admin',
  PROJECT_MANAGER:'project_manager',
  USER:'user'
}
export const availableRoles= Object.values(UserRolesEnum);
export const TaskStatusEnum={
  TODO:'todo',
  IN_PROGRESS:'in_progress',
  DONE:'done'
}
export const availableTaskStatuses= Object.values(TaskStatusEnum);