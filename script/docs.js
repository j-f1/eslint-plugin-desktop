const path = require('path')
const fs = require('fs')

const chalk = require('chalk')
const diff = require('diff')
const ora = require('ora')

const isChecking = process.argv[2] === 'check'
const verb = isChecking ? 'Checking' : 'Updating'

const projectRoot = path.resolve(__dirname, '..')

const rulesDir = path.join(projectRoot, 'lib', 'rules')
const docsDir = path.join(projectRoot, 'docs', 'rules')
const readmePath = path.resolve(projectRoot, 'README.md')

const spinner = ora('Reading rules...').start()

const rulePaths = fs
  .readdirSync(rulesDir)
  .map(name => path.resolve(rulesDir, name))

const ruleLines = []

for (const rulePath of rulePaths) {
  const name = path.basename(rulePath, path.extname(rulePath))
  spinner.start(
    `${verb} rule ${rulePaths.indexOf(rulePath)} of ${rulePaths.length}...`
  )

  const data = require(rulePath)
  if (!(data.meta && data.meta.docs && data.meta.docs.description)) {
    spinner.fail(`Rule ${name} does not have a description`)
    process.exitCode = 1
    break
  }
  const description = data.meta.docs.description

  const docFile = path.resolve(docsDir, name + '.md')
  const docs = fs.readFileSync(docFile, 'utf-8').split('\n')
  const friendlyPath = path
    .relative(projectRoot, docFile)
    .replace(name, chalk.bold(name))

  const newDocs = [`# ${description} (${name})`]
    .concat(docs.slice(1))
    .join('\n')
  if (newDocs !== docs.join('\n')) {
    if (isChecking) {
      spinner.fail(
        `The description for ${chalk.bold(
          name
        )} must match the required format:`
      )
      console.error(
        colorDiff(friendlyPath, 'generated', docs.join('\n'), newDocs)
      )
      process.exitCode = 1
      break
    } else {
      spinner.info(`Updating the docs for ${chalk.bold(name)}:`)
      console.log(
        colorDiff(friendlyPath, 'generated', docs.join('\n'), newDocs)
      )
    }
  }

  ruleLines.push({
    name,
    description,
  })

  if (isChecking) {
    spinner.succeed(`${friendlyPath} is valid`)
  } else {
    fs.writeFileSync(docFile, newDocs)
    spinner.succeed(`${friendlyPath} is up-to-date`)
  }
}

if (!process.exitCode) {
  spinner.start(`${verb} README...`)
  const readme = fs.readFileSync(readmePath, 'utf-8')

  const ruleSection = ruleLines.map(
    ({ name, description }) =>
      `* [\`${name}\`](./docs/rules/${name}.md) — ${description}`
  )
  const updatedReadme = readme.replace(
    /<!-- begin rule list -->[\s\S]+<!-- end rule list -->/,
    `
<!-- begin rule list -->
${ruleSection.join('\n')}
<!-- end rule list -->
    `.trim()
  )

  if (updatedReadme !== readme) {
    if (isChecking) {
      spinner.fail('The README is not correctly formatted. Please update it:')
      console.error(colorDiff('README.md', 'generated', readme, updatedReadme))
    } else {
      spinner.info('Updating README:')
      console.log(colorDiff('README.md', 'generated', readme, updatedReadme))
    }
  }
  if (isChecking) {
    spinner.succeed('The README is valid')
  } else {
    fs.writeFileSync(readmePath, updatedReadme)
    spinner.succeed('README.md is up-to-date')
  }
}

function colorDiff(oldFile, newFile, oldText, newText) {
  return diff
    .createTwoFilesPatch(oldFile, newFile, oldText, newText)
    .split('\n')
    .slice(1) // strip the ====... line
    .map(chunk => {
      switch (chunk[0]) {
        case '+':
          return chalk.green(chunk)
        case '-':
          return chalk.red(chunk)
        case '@':
          return chalk.dim.blue(chunk)
        default:
          return chunk
      }
    })
    .join('\n')
}
