/**
 * Created by Xiao Ning Zhang on 1/6/16.
 */

function CommUtil()
{
    // check if an object is in the given array
    this.objInArray = function (obj, array)
    {
        var i = array.length;
        while (i--)
        {
            if (array[i] === obj)
            {
                return true;
            }
        }
        return false;
    };

    // generate a number x: low <= x < high
    this.genRandNumInRange = function(low, high)
    {
        var dif = high - low;
        var rnd = Math.random() * dif;
        var a = Math.floor(rnd) + low;
        return a;
    };

    // generate an array of random numbers: low <= [x1, x2...] < high
    this.genRandNumArrayInRange = function(low, high, count)
    {
        var array = [];
        for ( var i=0; i<count; i++ )
        {
            var rand = this.genRandNumInRange(low, high);
            array.push(rand);
        }
        return array;
    };

    // generate an array of random numbers: low <= [x1, x2...] < high,
    // which are all different
    this.genRandNumArrayInRangeDiff = function(low, high, count)
    {
        var array = [];
        var i = 0;
        while ( i < count )
        {
            var rand = this.genRandNumInRange(low, high);
            if ( !this.objInArray(rand, array) )
            {
                array.push(rand);
                i++;
            }
        }
        return array;
    };

    // generate an array of random numbers: low <= [x1, x2...] < high,
    // which are all different
    this.genRandNumOptsIncludX = function(low, high, count, x)
    {
        var arry = this.genRandNumArrayInRangeDiff(low, high, count);
        if ( !this.objInArray(x, arry) )
        {
            var rd = this.genRandNumInRange(0, count);
            arry[rd] = x;
        }
        return arry;
    };

    // create a question object with given property and values
    this.createQuestion = function(props)
    {
        var q = {'sbj_name':'', 'content':'', 'grade_point':'',
                 'point_type':'', 'difficulty':'', 'answer':'', 'type':'',
                 'quest_text':'', 'answer_options':'', 'content_pic':''};
        for ( prop in props )
        {
            q[prop] = props[prop];
        }
        return q;
    };

}