/**
 * Created by Xiao Ning Zhang on 1/5/16.
 */

load('commUtil.js');
load('constants.js');

util = new CommUtil();
constants = new Constants();

// just for test
//helper = new QuestSequenceHelper();
//helper.createQuestions();

function QuestSequenceHelper()
{
    this.SEQUENCE_DEFAULT_LENGTH = 10;

    this.createQuestions = function()
    {
        var questions = [];
        var ql1 = this.genEqualDiffSequences([0, 1, 2], [1, 2, 3, 4, 5, 6, 10]);
        var ql2 = this.genMixedEqualDiffSequences();
        var ql3 = this.genSpecialSequences();
        questions = ql1.concat(ql2, ql3);
        return questions;
    };

    this.genMixedEqualDiffSequences = function(startOpts, diffOpts)
    {
        var seqs = [];

        // mixed equal-diff sequence like: 1, 10, 2, 9, 3, 8...
        for (var i=0; i<10; i++ )
        {
            var astart = util.genRandNumInRange(1, 5);
            var bstart = util.genRandNumInRange(1, 5) * 10;
            var adiff = util.genRandNumInRange(1, 4);
            var bdiff = util.genRandNumInRange(1, 3) * 5;
            var rnd = util.genRandNumInRange(0, 2);
            if ( rnd == 0 )
            {
                bdiff = util.genRandNumInRange(1, 3) * (-1);
            }
            var seqa = this.genOneEqualDiffSeq(astart, adiff, 5);
            var seqb = this.genOneEqualDiffSeq(bstart, bdiff, 5);
            var seq = [];
            for ( var k=0; k<5; k++ )
            {
                seq[k*2] = seqa[k];
                seq[k*2+1] = seqb[k];
            }
            result = this.setAnswerInSeq(seq);
            var cont = this.seq2Str(seq);
            var props = {'sbj_name':'数学', 'content':cont, 'grade_point':'sequence-simple',
                         'point_type':'seq-equal-diff-mixed', 'level':constants.QUESTION_LEVEL_MEDIUM,
                         'answer':result, 'type':'simple'};
            var q2 = util.createQuestion(props);
            seqs.push(q2);
        }
        return seqs;
    };

    this.genEqualDiffSequences = function(startOpts, diffOpts)
    {
        var seqs = [];
        for ( var i in startOpts )
        {
            for ( var j in diffOpts )
            {
                var len = this.SEQUENCE_DEFAULT_LENGTH;
                var seq = this.genOneEqualDiffSeq(startOpts[i], diffOpts[j], len);
                result = this.setAnswerInSeq(seq);
                var cont = this.seq2Str(seq);
                var props = {'sbj_name':'数学', 'content':cont, 'grade_point':'sequence-simple',
                             'point_type':'seq-equal-diff-mixed', 'level':constants.QUESTION_LEVEL_BASIC,
                             'answer':result, 'type':'simple'};
                var q = util.createQuestion(props);
                seqs.push(q);
            }
        }
        return seqs;
    };

    this.genSpecialSequences = function(startOpts, diffOpts)
    {
        var seqs = [];

        // sequence like: 1, 1, 5, 2, 2, 10, 3, 3, 15
        var cont = "1, 1, 5, 2, 2, 10, 3, 3, 15, $ANSWER, $ANSWER, $ANSWER";
        var result = "4--4--20";
        var props = {'sbj_name': '数学', 'content': cont, 'grade_point': 'sequence-simple',
            'point_type': 'seq-repeat3', 'level': constants.QUESTION_LEVEL_ADVANCED,
            'answer': result, 'type': 'repeat3'};
        var q = util.createQuestion(props);
        seqs.push(q);

        // fibonacci sequence
        var cont = "1, 1, 2, 3, 5, 8, $ANSWER, 21, $ANSWER, 55";
        var result = "13--34";
        var props = {'sbj_name': '数学', 'content': cont, 'grade_point': 'sequence-simple',
            'point_type': 'seq-fibonacci', 'level': constants.QUESTION_LEVEL_ADVANCED,
            'answer': result, 'type': 'fibonacci'};
        var q = util.createQuestion(props);
        seqs.push(q);

        // prev-3-sum sequence
        var cont = "1, 1, 1, 3, 5, 9, $ANSWER, 31";
        var result = "13--34";
        var props = {'sbj_name': '数学', 'content': cont, 'grade_point': 'sequence-simple',
            'point_type': 'seq-prev-3-sum', 'level': constants.QUESTION_LEVEL_ADVANCED,
            'answer': result, 'type': 'prev-3-sum'};
        var q = util.createQuestion(props);
        seqs.push(q);

        // tuple sequence 1
        cont = "(1, 2, 3), (2, 4, 5), (3, 6, 7), ($ANSWER, $ANSWER, $ANSWER)";
        result = "4--8--9";
        props = {'sbj_name': '数学', 'content': cont, 'grade_point': 'sequence-simple',
            'point_type': 'seq-tuple', 'level': constants.QUESTION_LEVEL_ADVANCED,
            'answer': result, 'type': 'tuple'};
        q = util.createQuestion(props);
        seqs.push(q);

        // tuple sequence 2
        cont = "(1, 3, 4), (3, 5, 8), (5, 7, 12), ($ANSWER, $ANSWER, $ANSWER)";
        result = "7--9--16";
        props = {'sbj_name': '数学', 'content': cont, 'grade_point': 'sequence-simple',
            'point_type': 'seq-tuple', 'level': constants.QUESTION_LEVEL_ADVANCED,
            'answer': result, 'type': 'tuple'};
        q = util.createQuestion(props);
        seqs.push(q);

        // tuple sequence 3
        cont = "(1, 3), (4, 6), (7, 9), (10, 12), ($ANSWER, $ANSWER)";
        result = "13--15";
        props = {'sbj_name': '数学', 'content': cont, 'grade_point': 'sequence-simple',
            'point_type': 'seq-tuple', 'level': constants.QUESTION_LEVEL_ADVANCED,
            'answer': result, 'type': 'tuple'};
        q = util.createQuestion(props);
        seqs.push(q);

        return seqs;
    }

    this.setAnswerInSeq = function(seq)
    {
        var m = 5;
        var n = util.genRandNumInRange(6, 9);
        var ans1 = seq[m];
        var ans2 = seq[n];
        var result = ans1 + "--" + ans2;
        seq[m] = "$ANSWER";
        seq[n] = "$ANSWER";
        return result;
    };

    this.seq2Str = function(seq)
    {
        var str = "";
        for ( var k in seq )
        {
            str = str + seq[k];
            if ( k != seq.length-1 )
            {
                str = str + ", ";
            }
        }
        print(str);
        return str;
    };

    this.genOneEqualDiffSeq = function(start, diff, len)
    {
        var seq = [];
        for ( var i=0; i<len; i++ )
        {
            seq[i] = start + diff * i;
        }
        return seq;
    }
}