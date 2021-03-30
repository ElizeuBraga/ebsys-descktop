# my-app

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

##seting variables envioriment
In your console

For Windows set MY_VARIABLE=true

For linux $ export MY_VARIABLE=true


[
    {
        "profiles":[
            {"name":"Adm"},
            {"name":"Op"}
        ],

        "users":[
            {
                "name":"Elizeu", 
                "email":"elizeu@gmail.com",
                "phone":"61998636231",
                "password":"123456",
                "profile_id":"1"
            }
        ],

        "sections":[
            {"name":"Hamburguers"},
            {"name":"Filé"},
            {"name":"Frango"},
            {"name":"Bebidas"}
        ],

        "products":[
            {"name":"X tudo", "price":"15", "section_id":"1"},
            {"name":"X filé", "price":"15", "section_id":"2"},
            {"name":"X tudfrango", "price":"15", "section_id":"3"}
        ]
    }    
]
