/**
 * Created by admin on 1/2/16.
 */
load('commUtil.js');
load('questFigureHelper.js');

conn = new Mongo();
db = conn.getDB("smartlearn");

util = new CommUtil();

isNotEmpty = function(obj)
{
    return obj != undefined && obj != '';
}

func3 = function()
{
    var arry = [12, 22, 33, 44];
    for ( var i in arry )
    {
        var j = Number(i) + 1;
        print('j = ' + j);
    }

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

testFigureQuests = function()
{
    print('start to generate figure questions...');
    var helper = new QuestFigureHelper();
    var quests = helper.createQuestions();
    for (var i in quests )
    {
        print('printing question ' + i);
        for ( prop in quests[i] )
        {
            print(prop + ' == ' + quests[i][prop]);
        }
    }
};

//testFigureQuests();
func3();

