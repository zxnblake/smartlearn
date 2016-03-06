/**
 * Created by Xiao Ning Zhang on 12/29/15.
 */

load('questAddSubHelper.js');
load('questCompareHelper.js');
load('questSequenceHelper.js');
load('questFigureHelper.js');

function QuestionHelper()
{
    this.createQuestions = function ()
    {
        var questions = [];
        var ql1 = [];
        var ql2 = [];

        var questAddSubHelper = new QuestAddSubHelper();
        ql1 = questAddSubHelper.createQuestions();
        var questCompareHelper = new QuestCompareHelper();
        ql2 = questCompareHelper.createQuestions();
        var questSequenceHelper = new QuestSequenceHelper();
        ql3 = questSequenceHelper.createQuestions();
        var questFigureHelper = new QuestFigureHelper();
        ql4 = questFigureHelper.createQuestions();

        questions = ql1.concat(ql2, ql3, ql4);
        return questions;
    }
}