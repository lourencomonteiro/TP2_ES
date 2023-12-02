// UserServiceFactory.test.js

const UserServiceFactory = require("./UserServiceFactory");

describe("UserService", () => {
  let UserService;
  let UserModelMock;
  let buildUserMock;
  let NotAuthorizedErrorMock;
  let PermissionErrorMock;
  let QueryErrorMock;

  beforeEach(() => {
    UserModelMock = {
      findOne: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
    };
    buildUserMock = jest.fn();
    NotAuthorizedErrorMock = jest.fn();
    PermissionErrorMock = jest.fn();
    QueryErrorMock = jest.fn();

    UserService = UserServiceFactory({
      UserModel: UserModelMock,
      buildUser: buildUserMock,
      NotAuthorizedError: NotAuthorizedErrorMock,
      PermissionError: PermissionErrorMock,
      QueryError: QueryErrorMock,
    });
  });

  describe("create", () => {
    test("should create a new user if email is not already taken", async () => {
      UserModelMock.findOne.mockResolvedValue(null);

      const body = { name: "John Doe", email: "john@example.com", password: "password" };
      await UserService.create(body);

      expect(buildUserMock).toHaveBeenCalledWith(body);
      expect(UserModelMock.create).toHaveBeenCalledWith(buildUserMock());
    });

    test("should throw QueryError if email is already taken", async () => {
      UserModelMock.findOne.mockResolvedValue({});

      const body = { name: "John Doe", email: "john@example.com", password: "password" };
      await expect(UserService.create(body)).rejects.toThrow("E-mail já cadastrado!");
    });
  });

  describe("getAll", () => {
    test("should return all users except the specified userId", async () => {
      const userId = 1;
      const mockUsers = [{ id: 2, name: "User2", email: "user2@example.com" }];
      UserModelMock.findAll.mockResolvedValue(mockUsers);

      const result = await UserService.getAll(userId);

      expect(UserModelMock.findAll).toHaveBeenCalledWith({
        attributes: ["id", "name", "email"],
        where: {
          id: {
            [Op.not]: userId,
          },
        },
      });
      expect(result).toEqual(mockUsers);
    });

    test("should throw QueryError if no users are returned", async () => {
      UserModelMock.findAll.mockResolvedValue([]);

      const userId = 1;
      await expect(UserService.getAll(userId)).rejects.toThrow("Nenhum usuário retornado!");
    });
  });

  describe("getById", () => {
    test("should return user by ID", async () => {
      const mockUser = { id: 1, name: "John Doe", email: "john@example.com" };
      UserModelMock.findByPk.mockResolvedValue(mockUser);

      const result = await UserService.getById(1);

      expect(UserModelMock.findByPk).toHaveBeenCalledWith(1, {
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });
      expect(result).toEqual(mockUser);
    });

    test("should throw QueryError if user with the specified ID is not found", async () => {
      UserModelMock.findByPk.mockResolvedValue(null);

      await expect(UserService.getById(1)).rejects.toThrow("Não há um usuário com o ID 1!");
    });
  });

  describe("update", () => {
    // Add tests for update method
    test("should update user by ID if the logged user has permission", async () => {
      const mockUser = { id: 1, name: "John Doe", email: "john@example.com" };
      UserModelMock.findByPk.mockResolvedValue(mockUser);

      const body = { name: "Updated Name" };
      const loggedUser = { id: 1 };
      await UserService.update(1, body, loggedUser);

      expect(UserModelMock.findByPk).toHaveBeenCalledWith(1);
      expect(mockUser.update).toHaveBeenCalledWith(body);
    });

    test("should throw NotAuthorizedError if logged user does not have permission", async () => {
      const mockUser = { id: 2, name: "User2", email: "user2@example.com" };
      UserModelMock.findByPk.mockResolvedValue(mockUser);

      const body = { name: "Updated Name" };
      const loggedUser = { id: 1 };
      await expect(UserService.update(2, body, loggedUser)).rejects.toThrow(
        "Você não tem permissão para editar outro usuário!"
      );
    });
  });

  describe("delete", () => {
    // Add tests for delete method
    test("should delete user by ID if the logged user has permission", async () => {
      const mockUser = { id: 2, name: "User2", email: "user2@example.com" };
      UserModelMock.findByPk.mockResolvedValue(mockUser);

      const idReqUser = 1;
      await UserService.delete(2, idReqUser);

      expect(UserModelMock.findByPk).toHaveBeenCalledWith(2);
      expect(mockUser.destroy).toHaveBeenCalled();
    });

    test("should throw PermissionError if trying to delete own user", async () => {
      const idReqUser = 1;
      await expect(UserService.delete(idReqUser, idReqUser)).rejects.toThrow(
        "Não é possível deletar o próprio usuário!"
      );
    });
  });
});
