# 100x-Backend
100x Blog Platform Backend

### Install

```shell
$ yarn install
```

### Start Server
```shell
$ nodemon
```

### Mock Data

Navigate to ```localhost:3000/graphiql ``` </br></br>
Example Query

```  
query {  
  getAllPosts {
    id  
    author  
    permlink  
    title  
    body  
    net_votes  
    children  
    curator_payout_value  
    trending
    post_type  
    tag1
    tag2
    tag3
    tag4
    tag5
  }  
}
```

Example getPostReplies query

```
// get specific post replies using author and permlink

{
  getPostReplies(author: "steemit", permlink: "firstpost")
}
```
