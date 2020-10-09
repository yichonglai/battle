module.exports = async (ctx) => {
  const html = `
      <h1>request post</h1>
      <form method="POST" action="/api/upload" enctype="multipart/form-data">
        <p>file upload</p>
        <span>picName:</span><input name="picName" type="text" /><br/>
        <input name="file" type="file" /><br/><br/>
        <button type="submit">submit</button>
      </form>
    `;
    ctx.body = html;
}