const { User } = require('./models');
 
// users테이블 전체를 조회해서 그 결과값을 객체로 만들어 user변수에 넣어준다.
const user = User.findAll({}); 
 
// user변수에는 조회된 결과 객체가 들어있어서, 해당 테이블 컬럼들을 조회할수 있다.
console.log(user[0].comment) // findAll는 여러 행들을 조회하기에, 각 행들이 배열로 저장되어있다.
 // 따라서 배열 인덱스로 조회한다. 첫번째 행 users테이블에 comment필드를 조회하기
SELECT * FROM users;

const { User } = require('./models');
const { Op } = require('sequelize');
 
const user = User.findAll({
    attributes: ['name', 'age'],
    where: {
        married: true, // married = 1
        age: { [Op.gt]: 30 }, // age > 30;
    },
});
 
console.log(user.comment)