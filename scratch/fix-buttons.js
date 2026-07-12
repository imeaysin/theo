const fs = require("fs")

const replaces = [
  {
    file: "apps/web/src/features/home/pages/home-page.tsx",
    from: '<Button render={<Link to={routes.signIn} />} variant="outline">',
    to: '<Button asChild variant="outline">\n          <Link to={routes.signIn}>',
  },
  {
    file: "apps/web/src/features/home/pages/home-page.tsx",
    from: "Sign in\n        </Button>",
    to: "Sign in\n          </Link>\n        </Button>",
  },
  {
    file: "apps/web/src/features/dashboard/pages/dashboard-page.tsx",
    from: '<Button render={<Link to={routes.notes} />} variant="outline">',
    to: '<Button asChild variant="outline">\n          <Link to={routes.notes}>',
  },
  {
    file: "apps/web/src/features/dashboard/pages/dashboard-page.tsx",
    from: "Notes\n        </Button>",
    to: "Notes\n          </Link>\n        </Button>",
  },
  {
    file: "apps/web/src/features/dashboard/pages/dashboard-page.tsx",
    from: '<Button render={<Link to={routes.uploads} />} variant="outline">',
    to: '<Button asChild variant="outline">\n          <Link to={routes.uploads}>',
  },
  {
    file: "apps/web/src/features/dashboard/pages/dashboard-page.tsx",
    from: "Uploads\n        </Button>",
    to: "Uploads\n          </Link>\n        </Button>",
  },
  {
    file: "apps/web/src/features/auth/components/navbar-auth.tsx",
    from: "render={<Link to={defaultAuthenticatedRoute} />}",
    to: "asChild",
  },
  {
    file: "apps/web/src/features/auth/components/navbar-auth.tsx",
    from: "Dashboard\n        </Button>",
    to: "<Link to={defaultAuthenticatedRoute}>Dashboard</Link>\n        </Button>",
  },
  {
    file: "apps/web/src/features/auth/components/navbar-auth.tsx",
    from: '<Button render={<Link to={routes.signIn} />} size="sm">',
    to: '<Button asChild size="sm">\n      <Link to={routes.signIn}>',
  },
  {
    file: "apps/web/src/features/auth/components/navbar-auth.tsx",
    from: "Sign in\n    </Button>",
    to: "Sign in\n      </Link>\n    </Button>",
  },
  {
    file: "apps/web/src/app/router.tsx",
    from: "action={<Button render={<Link to={routes.home} />}>Go home</Button>}",
    to: "action={<Button asChild><Link to={routes.home}>Go home</Link></Button>}",
  },
]

replaces.forEach(({ file, from, to }) => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, "utf8")
    if (content.includes(from)) {
      fs.writeFileSync(file, content.replace(from, to))
      console.log(`Replaced in ${file}`)
    } else {
      console.log(`Could not find text in ${file}: ${from}`)
    }
  }
})
