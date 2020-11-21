# Create Mailgun Template Version

This GitHub action creates a new version for an existing Mailgun template in your domain, based on the content of a HTML file.
## Inputs

### `mailgun-api-key`

**Required** Your Mailgun Primary Account API key.

### `mailgun-host`

**Optional** Mailgun Host. Default: `api.mailgun.net`.

### `mailgun-domain-name:`

**Required** Your Domain name.

### `mailgun-template-name`

**Required** Name of an <ins>existing</ins> template.

### `html-file-path`

**Required** Path to file containing the HTML for the new template version.

## Example usage
```
# Check out your repo, so the action can access your HTML file
- name: Checkout
  uses: actions/checkout@v2
- name: Create email template version
  uses: jlepocher/mailgun-create-template-version-action@v1.1
  with:
    mailgun-host: 'api.eu.mailgun.net'
    mailgun-api-key: ${{ secrets.MAILGUN_API_KEY }}
    mailgun-domain-name: 'mydomain.com'
    mailgun-template-name: 'main'
    html-file-path: './html/emails/main_template.html'
```