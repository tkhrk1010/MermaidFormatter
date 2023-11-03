const assert = require('assert');
const { MermaidFormatter } = require('./MermaidFormatter'); // パスはMermaidFormatterクラスの実際の場所に置き換えてください。

// テストケースを実行する関数
function runTests() {
    let input, output, expected;

    // テストケース1: 単純な 'step'
    input = 
`
食材の購入
混ぜる
盛り付ける
`;

    expected = 
`code: mmd
 graph TD;
 1[食材の購入]
 1 --> 2[混ぜる]
 2 --> 3[盛り付ける]`;

    formatter = new MermaidFormatter();
    output = formatter.convertToMermaid(input);
    assert.strictEqual(output, expected);

    // テストケース2: 単純な 'if' と 'step'
    input = 
`
食材の購入
if 肉が早く炒め終わる
yes 肉のフライパンに野菜を入れる
no 野菜のフライパンに肉を入れる
空いたコンロでルーを煮込む
混ぜる
盛り付ける
`;

    expected = 
`code: mmd
 graph TD;
 1[食材の購入]
 1 --> 2{肉が早く炒め終わる}
 2 --> |yes| 3[肉のフライパンに野菜を入れる]
 2 --> |no| 4[野菜のフライパンに肉を入れる]
 3 --> 5[空いたコンロでルーを煮込む]
 4 --> 5[空いたコンロでルーを煮込む]
 5 --> 6[混ぜる]
 6 --> 7[盛り付ける]`;

    formatter = new MermaidFormatter();
    output = formatter.convertToMermaid(input);
    assert.strictEqual(output, expected);

    // テストケース3: 'step'に空白が含まれる
    input = 
`
食材の購入
混ぜる & かき混ぜる
盛り付ける
`;

    expected = 
`code: mmd
 graph TD;
 1[食材の購入]
 1 --> 2[混ぜる & かき混ぜる]
 2 --> 3[盛り付ける]`;

    formatter = new MermaidFormatter();
    output = formatter.convertToMermaid(input);
    assert.strictEqual(output, expected);

    // テストケース4: 'if'あり、かつ'step'に空白が含まれる
    input = 
`
食材の購入
if 肉が早く炒め終わる
 yes 肉のフライパンに野菜を入れる
 no 野菜のフライパンに肉を入れる
空いたコンロでルー & 米を煮込む
混ぜる
盛り付ける
`;

    expected = 
`code: mmd
 graph TD;
 1[食材の購入]
 1 --> 2{肉が早く炒め終わる}
 2 --> |yes| 3[肉のフライパンに野菜を入れる]
 2 --> |no| 4[野菜のフライパンに肉を入れる]
 3 --> 5[空いたコンロでルー & 米を煮込む]
 4 --> 5[空いたコンロでルー & 米を煮込む]
 5 --> 6[混ぜる & かき混ぜる]
 6 --> 7[盛り付ける]`;

    formatter = new MermaidFormatter();
    output = formatter.convertToMermaid(input);
    assert.strictEqual(output, expected);




    console.log('All tests passed!');
}

runTests();
