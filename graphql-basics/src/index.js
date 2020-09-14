import { GraphQLServer } from 'graphql-yoga';
import {v4 as uuidv4} from 'uuid';

// Type definition (schema)
// Scalar Type or Data type in GraphQL 
// String , Boolean, Int, Float, ID

// Non Scalar Type
// Object and Array

// At the end of eact data type, there is "!" mark, that show that This type will return someting other than null. if you donot put "!" at the end of data type, it will give "null" value to it.
// Relational operation

// create a user data
const users = [
    { id: "1", name: "Abnish", email: "abnish@example.com", age: 26 },
    { id: "2", name: "Alok", email: "alok@example.com" },
    { id: "3", name: "Rahul", email: "rahul@example.com", age: 24 }
]

const posts =[
    { id: "123", title: "GraphQL learning", body: "Best way to learn it", published: true, author: "1" },

    { id: "157", title: "A way to learn", body: "Fantastic GraphQL Book Every one should read", published: true, author: "1" },

    { id: "234", title: "A full stack developer", body: "Become a MERN Stack Developer", published: true, author: "2" }
]

const comments =[ 
    { id: "c1", text: "This is the first comment", author: "1", post: "123" },
    { id: "c2", text: "this is second comment", author: "2", post: "157" },
    { id: "c3", text: " This is third comment", author: "2", post: "123" },
    { id: "c4", text: "This is fourth comment", author: "1", post: "234" }
 ]

const typeDefs = `
    type Query{
        users(query: String): [User!]! 
        posts(query: String): [Post]!
        me: User!
        post: Post!
        comment: [Comment!]!
    }

    type Mutation {
        createUser(name: String! email: String! age: Int) : User!
        createPost(title: String! body: String! published: Boolean! author: String!): Post!
        createComment(text: String!, author: ID!, post: ID!): Comment!
    }

    type User{
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post]!
        comments: [Comment!]! 
    }

    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment]!
    }

    type Comment{
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`
const resolvers = {
    Query:{

        posts(parent, args, ctx, info){
            if(!args.query){
                return posts
            }
            return posts.filter(post=> {

                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                
                return isTitleMatch || isBodyMatch
             })},

        users(parent, args, ctx, info){
            if(!args.query){
                return users
            }

            return users.filter(user=> user.name.toLocaleLowerCase().includes(args.query.toLowerCase())
            )
        },

        comment(){
            return comments
        }
    },
    // rosolver function for createUser, and createpost mutation 

    Mutation: {
        createUser(parent, args, ctx, info){
            const emailTaken = users.some((user)=> user.email === args.email)
            
            if(emailTaken){
                throw new Error("Email already exists")
            }

            const user ={
                id: uuidv4(),
                name: args.name,
                email: args.email,
                age: args.age
            }

            users.push(user)
            return user

        },
        createPost(parent, args, ctx, info){
            const userExist = users.some((user)=>user.id === args.author)

            if(!userExist){
                throw new Error("User not valid")
            }

            const post = {
                id: uuidv4(),
                title: args.title,
                body: args.body,
                published: args.published,
                author: args.author,
            }
            posts.push(post)
            return post
        },
        createComment(parent, args, ctx, info){
            const userExists = users.some((user) => user.id === args.author)
            const postExists = posts.some((post) => post.id === args.post && post.published)

            if (!userExists || !postExists) {
                throw new Error('Unable to find user and post')
            }

            const comment = {
                id: uuidv4(),
                text: args.text,
                author: args.author,
                post: args.post
            }

            comments.push(comment)

            return comment
        }
    },

    Post: {
        author(parent, args, ctx, info){
            return users.find((user)=>  {
            return user.id === parent.author})
        },
        comments(parent, args, ctx, info){
            return comments.filter(comment=>{
                return comment.post === parent.id
            })
        }
    },
    User: {
        posts(parent, args, ctx, info){
            return posts.filter((post)=>{
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info){
            return comments.filter((comment)=>{
                return comment.author === parent.id
            })
        } 
    },

    Comment: {
        author(parent, args, ctx, info){
            return users.find((user)=>{
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info){
            return posts.find((post)=>{
                return post.id === parent.post
            })
        }
    },
} 

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=>{
    console.log(" The server is up!")
})

// access of the mutation of create user and create post 

// creare user mutation

// mutation{
//     createUser(name: "Ashish", email:"ashish@example.com", age:25){
//       id
//       name
//       age
//       email
//     }
//   }


// create post mutation 

// mutation{
//     createPost(
//       title: "my updated post",
//       body: "updated body",
//       published:false,
//       author: "90562142-e14e-440c-8e8c-90e0bd494f6d"( this id is same of user id )
//     )
//   {
//     id
//     title
//     body
//     published
//     author{
//       name
//       email
//       comments{
//         text
//       }
//     }
//   }
//   }




// Now the above is the relation between the comments, users, posts and author. to access this below is the code

// query{
//     posts{
//       id
//       author{
//         name
//       }
//         comments{
//         id
//         text
//         author{
//           name
//         }
//       }
//     }
//   }

// this is the OUTPUT


// {
//     "data": {
//       "posts": [
//         {
//           "id": "123",
//           "author": {
//             "name": "Abnish"
//           },
//           "comments": [
//             {
//               "id": "c1",
//               "text": "This is the first comment",
//               "author": {
//                 "name": "Abnish"
//               }
//             },
//             {
//               "id": "c3",
//               "text": " This is third comment",
//               "author": {
//                 "name": "Alok"
//               }
//             }
//           ]
//         },
//         {
//           "id": "157",
//           "author": {
//             "name": "Abnish"
//           },
//           "comments": [
//             {
//               "id": "c2",
//               "text": "this is second comment",
//               "author": {
//                 "name": "Alok"
//               }
//             }
//           ]
//         },
//         {
//           "id": "234",
//           "author": {
//             "name": "Alok"
//           },
//           "comments": [
//             {
//               "id": "c4",
//               "text": "This is fourth comment",
//               "author": {
//                 "name": "Abnish"
//               }
//             }
//           ]
//         }
//       ]
//     }
//   }




// IF you donot pass agruments and want to return an array, you can write code in this manner. 

// type Query{
//     users: [User!]! }

// inside resolver 
//   users(){
//     return users
// },

// If you want to access these array data, write code in this manner in playground; 

// query{
	// users{
    //     id
    //     name
    //     age
    //     email
    //   } }


    // me(){
    //     return{
    //         id: "12345",
    //         name: "Abnish",
    //         email: "akp12556@gmail.com",
    //         age: 24,
    //         name: "Alok"
    //     }
    // },
    // post(){
    //     return{
    //         id: "45678",
    //         title: "This is first Post",
    //         body: "About GraphQL",
    //         published: false
    //     }
    // }




// const typeDefs =`
//     type Query{
//         id: ID!
//         name: String!
//         age: Int!
//         employed: Boolean!
//         gpa: Float!
      
//     }
// `

// Array type 

// type Query{
//     greetings(name: String, position: String): String!
//     addValue(v1: Float!, v2: Float!): String!
//     addNumber(count: [Float!]!): Float!
//     grades: [Int!]!
//     me: User!
//     post: Post!
// }

// Array Resolvers

// addValue(parent, args, ctr, info){
//     if(args.v1 && args.v2){
//         return  `Sum is ${args.v1}` + `${args.v2}`
//     }
//     else if(args){
//         return args
//     }
// },

// // passed array as a arguments

// addNumber(arparent, args, ctr, infogs){
//     if(args.count.length === 0){
//         return 0
//     }

//     return args.count.reduce((accumulator, currentValue)=>{
//         return accumulator + currentValue
//     })
// },

// // returm array
// grades(){
//     return [1,2,3]
// },

// greetings(parent, args, ctr, info){
//     if(args.name && args.position){
//         return `Hello ${args.name}! I am a best ${args.position}`
//     }
//     else if(args.name){
//         return `Hello ${args.name}!`
//     }
//     else if(args.position){
//         return `Your position is ${args.position}`
//     }
//         return "Hello!"
    
// },


// const typeDefs = `
//     type Query{
//         title: String!
//         price: Float!
//         releasingYear: Int!
//         rating: Float
//         isStock: Boolean!
//     }
// `
// // Resolvers

// const resolvers = {
//     Query: {
//         id(){
//             return "abc123"
//         },
//         name(){
//             return "Abnish Kumar"
//         },
//         age(){
//             return 27
//         },
//         employed(){
//             return "Software Developer"
//         },
//         gpa(){
//             return 3.1
//         }
//     }
// }
