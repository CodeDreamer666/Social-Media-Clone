export type SinglePost = {
    user: {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        username: string | null;
        bio: string;
        postsCount: number;
        email: string;
        emailVerified: boolean;
        image: string | null;
        isPublic: boolean;
    },
    id: string,
    userId: string,
    content: string,
    createdAt: Date,
    updatedAt: Date,
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
        likes: {
            id: string;
            userId: string;
            postId: string;
        }[];
    } & {
        id: string;
        userId: string;
        content: string;
        likeCount: number;
        commentCount: number;
        createdAt: Date;
        updatedAt: Date;
    })[];
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    username: string | null;
    bio: string;
    followersCount: number;
    followingCount: number;
    postsCount: number;
    email: string;
    emailVerified: boolean;
    image: string | null;
    isPublic: boolean;
}