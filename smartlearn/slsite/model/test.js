/**
 * Created by admin on 1/2/16.
 */
load('commUtil.js');

conn = new Mongo();
db = conn.getDB("smartlearn");

util = new CommUtil();

func3 = function()
{
    var x = util.genRandNumInRange(10, 20);
    print('x=' + x);

//    var arry = [10, 20, 30, 40, 50];
//    for ( var i in arry )
//    {
//        print('i=' + i);
//        print('arry[i]=' + arry[i]);
//    }
};

func2 = function(db)
{
    var users = db.user.find();
    while (users.hasNext())
    {
        u = users.next();
        print(u["_id"] + "\t" + u["name"]);
    }
};

func1 = function()
{
    for (var i=0; i<30; i++)
    {
        var a = 15;
        var b = 30;
        var dif = b - a;
        var rnd = Math.random() * dif;
        var a = Math.floor(rnd) + 15;
        print(a);
    }
};

func3();

