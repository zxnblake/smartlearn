/**
 * Created by admin on 1/6/16.
 */

function CommUtil()
{
    // generate a number x: low <= x < high
    this.genRandNumInRange = function(low, high)
    {
        var dif = high - low;
        var rnd = Math.random() * dif;
        var a = Math.floor(rnd) + low;
        return a;
    };


}