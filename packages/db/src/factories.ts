import { faker } from "@faker-js/faker";
import { UserModel, type IUserDocument } from "./models";

export const UserFactory = {
  build: (overrides: Partial<IUserDocument> = {}): Partial<IUserDocument> => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      emailVerified: true,
      image: faker.image.avatar(),
      role: "user",
      banned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  },

  create: async (overrides: Partial<IUserDocument> = {}) => {
    const data = UserFactory.build(overrides);
    const doc = new UserModel(data);
    await doc.save();
    return doc;
  },

  createMany: async (count: number, overrides: Partial<IUserDocument> = {}) => {
    const promises = Array.from({ length: count }).map(() =>
      UserFactory.create(overrides),
    );
    return Promise.all(promises);
  },
};
