export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
        UPDATE_PROFILE: "/api/auth/profile",
    },
BOOKS: {
        CREATE_BOOK: "/api/books",
        GET_BOOKS: "/api/books",
        GET_ALL_BOOKS: "/api/books/all",
        GET_BOOK_BY_ID: "/api/books",
        GET_BOOKS_BY_USER: "/api/books/user",
        UPDATE_BOOK: "/api/books",
        DELETE_BOOK: "/api/books",
        UPDATE_COVER: "/api/books/cover",
        TRANSFER_BOOK: "/api/books/transfer",
        SCHEDULE_BOOK: "/api/books/schedule",
        CANCEL_SCHEDULE: "/api/books/schedule/cancel",
    },
    AI: {
        GENERATE_OUTLINE: "/api/ai/generate-outline",
        GENERATE_CHAPTER_CONTENT: "/api/ai/generate-chapter-content",
        GENERATE_BOOK_COVER: "/api/ai/generate-book-cover",
        TRANSLATE: "/api/ai/translate",
    },
    EXPORT: {
        PDF: "/api/export",
        DOC: "/api/export",
    },
    CONTACT: {
        SUBMIT: "/api/contact",
    },
    TICKETS: {
        CREATE: "/api/tickets",
        GET_ALL: "/api/tickets",
        GET_ALL_ADMIN: "/api/tickets/all",
        GET_BY_ID: "/api/tickets",
        ADD_REPLY: "/api/tickets",
        UPDATE_STATUS: "/api/tickets",
        DELETE: "/api/tickets",
    },
    ADMIN: {
        GET_USERS: "/api/admin/users",
        UPDATE_USER_ROLE: "/api/admin/users",
        DELETE_USER: "/api/admin/users",
    },
    USERS: {
        GET_USER: "/api/admin/users",
    },
    TRANSFER: {
        CREATE: "/api/transfer",
        GET_MY: "/api/transfer/my",
        GET_ALL: "/api/transfer/all",
        RESPOND: "/api/transfer",
    },
    SUBSCRIPTIONS: {
        GET_WRITERS: "/api/subscriptions/writers",
        SUBSCRIBE: "/api/subscriptions",
        GET_MY: "/api/subscriptions/my",
        GET_SUBSCRIBERS: "/api/subscriptions/subscribers",
        GET_SUBSCRIBER_COUNT: "/api/subscriptions/subscribers",
        CANCEL: "/api/subscriptions",
    },
    INBOX: {
        GET_MESSAGES: "/api/inbox",
        GET_UNREAD_COUNT: "/api/inbox/unread-count",
        MARK_READ: "/api/inbox",
        DELETE: "/api/inbox",
        SEND: "/api/inbox/send",
    },
    REVIEWS: {
        CREATE: "/api/reviews",
        GET_BY_WRITER: "/api/reviews/writer",
        GET_RATING: "/api/reviews/writer",
        DELETE: "/api/reviews",
    },
    BOOK_REVIEWS: {
        CREATE: "/api/book-reviews",
        GET_BY_BOOK: "/api/book-reviews/book",
        GET_RATING: "/api/book-reviews/book",
        GET_MY: "/api/book-reviews/book",
        DELETE: "/api/book-reviews",
    },
    CHATBOT: {
        MESSAGE: "/api/chatbot/message",
        CAPABILITIES: "/api/chatbot/capabilities",
        RECOMMEND: "/api/chatbot/recommend",
        MEANING: "/api/chatbot/meaning",
        QUIZ: "/api/chatbot/quiz",
        TOP_WRITERS: "/api/chatbot/top-writers",
        CATEGORIES: "/api/chatbot/categories",
    },
    CATEGORIES: {
        GET_ALL: "/api/categories",
        SEARCH: "/api/categories/search",
        CREATE: "/api/categories",
        CREATE_WITH_SUBCATEGORY: "/api/categories/with-subcategory",
        ADD_SUBCATEGORY: (id) => `/api/categories/${id}/subcategories`,
    },
};

export const BASE_URL ="https://ebookcreatorbackend.onrender.com" 
// export const BASE_URL ="http://localhost:8000" 