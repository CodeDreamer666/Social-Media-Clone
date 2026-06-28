export type SinglePost = {
    user: UserBase,
    id: string,
    userId: string,
    content: string,
    createdAt: Date,
    updatedAt: Date,
}

type UserBase = {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    username: string | null;
    bio: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    isPublic: boolean;
}

export type User = {
    posts: ({
        comments: {
            id: string;
            userId: string;
            content: string;
            createdAt: Date;
            updatedAt: Date;
            postId: string;
        }[];
    } & {
        id: string;
        userId: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    })[];
} & UserBase