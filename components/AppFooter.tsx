export default function AppFooter() {
  const year = new Date().getFullYear()
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? '0.1.0'

  return (
    <footer style={{
      marginTop: '3rem',
      padding: '1.25rem 1rem',
      borderTop: '1px solid var(--color-border)',
      textAlign: 'center',
      fontSize: '0.78rem',
      color: 'var(--color-muted)',
      lineHeight: 1.6,
    }}>
      <p style={{ margin: 0 }}>
        v{version} &nbsp;·&nbsp; © {year} Éric Tristram &nbsp;·&nbsp;
        Co-développé avec{' '}
        <a
          href="https://claude.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline dotted' }}
        >
          Claude
        </a>{' '}
        (Anthropic)
      </p>
      <p style={{ margin: '0.2rem 0 0' }}>
        L&apos;IA sait tout sur le whey — sauf ce que ça goûte.
      </p>
    </footer>
  )
}
