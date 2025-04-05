improve english and make more understable to other AI

---

### Make My Buddy

It is a educational app for an hackathon so use such that it build fast , it has best ui with good animations and use technologies that make coding as easy as possible

you have to make app in react native expo with use of native wind and any other library as you wish , for state management use redux

### concept of an app

- Use can login and after that they can do anything they want
    
- they can search other user make them buddy or can add to buddies
    
- buddy is a special user for each user and it can be max 1 user at a time .
    
- with that buddy user make tasks and add them to schedule .
    
- buddies is kind of connection with them user can chat .
    
- user can find buddy base on user goal
    
- while creating a account user set his goal ( Eg : title : Jee main , target : under 3 degits rank , year : 2027 , level : intermediate ) base on this use will provide suggestions ( other user ) which them user can make buddy
    
- other then this user can join community , like Jee main , jee maths , jee 2027 ....
    
- in that there are other users also , user can communicate with them and also find buddy bu him self .
    
- In sort user and buddy has same goal . buddies can be anything base on what user wants .
    
- in app user can communicate in chat , can arrange google meet , can share resources
    

## Tabs ( bottom navigation )

- Home
    
- Chat
    
- Resources
    
- Profile
    

### Home

- in this use show main goal and the suggest of making buddy ( if not make )
    
- at first user show calendar in this use can show dates ( tasks deadlines) , also syncronise with buddy
    
- It show notifications ( ongoing meetings , buddy request , buddies request ).
    
- after that use show them daily tasks , it is a comprarision of progress of user vs buddy tasks , kind of checklist but whith show deteils . user can check that by swaping left to right . use can check only his not buddys , when buddy do mark as done then color of that became dull .
    
- there is also button to create a new task
    
- after daily there is a list of weeklu , monthly and year goals
    
- Other things may add
    
- When user click on create new task btn , new dialog box open .
    

### Chats

- normal conversation which are personal and community ( only this 2 )
    
- all same thing which chat app have
    

### Resources

- it have 3 folders ( not real folders but ui kind of like that ) , Images , PDFs , Links
    
- each is clickable btn that have a searchable list of resources .
    

### Profile

- it show user profile
    
- and small section buddy profile
    
- it have 3 dot in this , which have edit profile , blocked users , pvs buddy ...
    

## Screens with schema

for this i am giving you a json file which is a export of an postman . plz take referance of this in Make My Buddy.postman_collection.json

## How to code

- You have to give code of React native expo , with nativewind and redux for state management with **TypeScript**
    
- use routes and it's value as mention in postman docs ( Make My Buddy.postman_collection.json ) , and also take ref of my comment that i made in postman .
    
- you have to make clean file scruture
    
- and make components and utils such that almost no duplicate code .
    
- All config files are in main directory and all coding is in src/
    
- for all apiyou have to make src/api/ ( eg . user.api.ts , chat.api.ts , axiosIntance.ts .....)
    
- for all redux stuff in src/redux ( thunks and state )
    
- all types in src/types
    
- all screns are in src/app/ ... ( src/app/auth , ../user , ../chat , ../task .....) , also have to use expo router for good navigation
    
- for other user profiles src/app/user/profile/[id].ts
    
- hope you understand structure and you have to make which follows this .
    

### Just for info

- I am using only one token which is name of token , can get when user login or signup .
    
- I know accessToken and refreshToken are best practices but for hacathon and simplicity I use just on etoken which have 1 yeasr life span .
    
- you have to use bearer authorization .


