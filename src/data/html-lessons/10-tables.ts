import type { HtmlLesson } from '../html-curriculum';

export const htmlTablesLesson: HtmlLesson = {
  id: 'html-tables',
  title: 'HTML Tables',
  slug: 'tables',
  chapter: 'tables',
  order: 10,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'Build data tables with rows, columns, headers, spanning cells, captions, and proper accessibility.',
  sections: [
    { type: 'text', content: 'HTML tables are used to display tabular data — data that belongs in rows and columns. Use tables for things like schedules, pricing comparison, sports scores, financial data. Do NOT use tables for page layout — that\'s what CSS Flexbox and Grid are for.' },
    { type: 'heading', content: 'Basic Table Structure' },
    { type: 'code', language: 'html',       content: 'A table is built from rows and cells. table is the outer container. tr creates a row. td creates a data cell. th creates a header cell — bold and centered by default. Every row must have the same number of cells for the table to display correctly.',
      code: `<!-- A table needs: table > tr > td  -->
<table>
  <tr>                     <!-- tr = table row -->
    <td>Row 1, Cell 1</td> <!-- td = table data cell -->
    <td>Row 1, Cell 2</td>
  </tr>
  <tr>
    <td>Row 2, Cell 1</td>
    <td>Row 2, Cell 2</td>
  </tr>
</table>` },
    { type: 'heading', content: 'Table Headers — <th>' },
    { type: 'code', language: 'html',       content: 'Use th elements for column headers instead of td. th is bold and centered by default, and tells screen readers this cell is a header. Adding scope="col" on th explicitly links it to its column for better accessibility.',
      code: `<!-- th = table header cell (bold and centered by default) -->
<table>
  <tr>
    <th>Name</th>
    <th>Age</th>
    <th>Role</th>
  </tr>
  <tr>
    <td>Alex</td>
    <td>25</td>
    <td>Developer</td>
  </tr>
  <tr>
    <td>Jordan</td>
    <td>28</td>
    <td>Designer</td>
  </tr>
</table>` },
    { type: 'heading', content: 'Semantic Table Structure: thead, tbody, tfoot' },
    { type: 'code', language: 'html',       content: 'thead, tbody, and tfoot divide the table into semantic sections. thead contains column headers. tbody contains the data rows. tfoot contains summary or totals. caption gives the table an accessible title. These sections help screen readers navigate and allow CSS to style each section independently.',
      code: `<table>
  <caption>Q1 2026 Sales Report</caption> <!-- Optional caption -->

  <thead>        <!-- Table header group -->
    <tr>
      <th>Product</th>
      <th>Units Sold</th>
      <th>Revenue</th>
    </tr>
  </thead>

  <tbody>        <!-- Table body -->
    <tr>
      <td>HTML Course</td>
      <td>1,200</td>
      <td>$24,000</td>
    </tr>
    <tr>
      <td>CSS Course</td>
      <td>890</td>
      <td>$17,800</td>
    </tr>
    <tr>
      <td>JS Course</td>
      <td>2,100</td>
      <td>$63,000</td>
    </tr>
  </tbody>

  <tfoot>        <!-- Table footer -->
    <tr>
      <td><strong>Total</strong></td>
      <td>4,190</td>
      <td>$104,800</td>
    </tr>
  </tfoot>
</table>` },
    { type: 'heading', content: 'Spanning Columns and Rows' },
    { type: 'code', language: 'html',       content: 'colspan merges cells horizontally — the cell spans across multiple columns. rowspan merges cells vertically — the cell spans multiple rows. When you use rowspan, the spanned rows have one fewer td since the merged cell covers that space.',
      code: `<!-- colspan: merge cells horizontally -->
<table>
  <tr>
    <th colspan="3">Full Name</th>
    <th>Score</th>
  </tr>
  <tr>
    <td>Alex</td>
    <td>James</td>
    <td>Smith</td>
    <td>95</td>
  </tr>
</table>

<!-- rowspan: merge cells vertically -->
<table>
  <tr>
    <th>Subject</th>
    <th>Teacher</th>
    <th>Room</th>
  </tr>
  <tr>
    <td rowspan="2">Math</td>  <!-- This cell spans 2 rows -->
    <td>Mr. Johnson</td>
    <td>Room 101</td>
  </tr>
  <tr>
    <!-- No td for subject — already spanned above -->
    <td>Mrs. Lee</td>
    <td>Room 203</td>
  </tr>
</table>` },
    { type: 'tryit', title: 'Try It: Data Table',
      html: `<h1>HTML Table Demo</h1>

<table>
  <caption>WebDev Atlas Course Comparison</caption>
  <thead>
    <tr>
      <th>Course</th>
      <th>Difficulty</th>
      <th>Duration</th>
      <th>Topics</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>HTML Basics</td>
      <td class="easy">Beginner</td>
      <td>2 weeks</td>
      <td>15</td>
    </tr>
    <tr>
      <td>CSS Mastery</td>
      <td class="medium">Intermediate</td>
      <td>3 weeks</td>
      <td>22</td>
    </tr>
    <tr>
      <td>JavaScript</td>
      <td class="medium">Intermediate</td>
      <td>6 weeks</td>
      <td>40</td>
    </tr>
    <tr>
      <td>React</td>
      <td class="hard">Advanced</td>
      <td>4 weeks</td>
      <td>30</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2"><strong>Total</strong></td>
      <td><strong>15 weeks</strong></td>
      <td><strong>107 topics</strong></td>
    </tr>
  </tfoot>
</table>`,
      css: `body { font-family: system-ui, sans-serif; padding: 20px; }
h1 { color: #1e1e1e; }
table { width: 100%; border-collapse: collapse; margin-top: 16px; }
caption { font-size: 14px; color: #6b7280; margin-bottom: 8px; font-style: italic; }
th { background: #1e1e1e; color: white; padding: 12px 16px; text-align: left; font-size: 13px; }
td { padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #374151; }
tr:hover td { background: #f9fafb; }
tfoot td { background: #f4f4f4; font-size: 14px; border-top: 2px solid #e5e7eb; }
.easy   { color: #15803d; font-weight: 700; }
.medium { color: #1d4ed8; font-weight: 700; }
.hard   { color: #c2410c; font-weight: 700; }`,
      mode: 'html' },
  ],
  exercises: [
    { id: 'tbl1', question: 'Which element defines a table header cell (bold, centered)?', type: 'multiple-choice', options: ['<td>', '<th>', '<tr>', '<thead>'], correct: 1, explanation: '<th> (table header) creates a header cell — bold and centered by default. <td> creates regular data cells.' },
    { id: 'tbl2', question: 'What attribute merges multiple columns into one cell?', type: 'multiple-choice', options: ['rowspan', 'colspan', 'merge', 'span'], correct: 1, explanation: 'colspan="N" makes a cell span N columns horizontally. rowspan="N" makes a cell span N rows vertically.' },
  ],
  quiz: [{ id: 'tq1', question: 'What is the correct order of table elements?', options: ['table > td > tr', 'table > tr > td', 'table > th > td', 'tr > table > td'], correct: 1, explanation: 'Correct: <table> contains <tr> (rows), and each <tr> contains <td> or <th> (cells). Never put <td> directly inside <table>.' }],
};
