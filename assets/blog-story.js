/* Youth Voice Blog: compose a private email; no backend storage or public posting. */
document.querySelectorAll('.blog-story-form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const topic = form.elements.namedItem('topic').value.trim();
    const idea = form.elements.namedItem('idea').value.trim();
    if (!topic || !idea) return;
    const subject = 'Youth Voice Blog story idea: ' + topic.slice(0,110);
    const body = 'Story idea / Предлог за приказна / Ide për histori:\n\n' +
       'Topic: ' + topic + '\n\n' + idea +
       '\n\n---\nSent by a visitor through the Pegasus Youth Voice Blog. Review and send this message in your email application.';
    const href = 'mailto:pegasusyouthvoice@gmail.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    const status = form.querySelector('.blog-story-status');
    if (status) status.hidden = false;
    window.location.href = href;
  });
});
