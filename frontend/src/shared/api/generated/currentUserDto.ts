export interface CurrentUserDto {
  userId: string;
  userName: string;
  email: string | null;
  roles: string[];
}
