export class UserExistsException {
  message: "Пользователь уже зарегистрирован";
  code: "BAD_REQUEST";
  status: 400;
}
