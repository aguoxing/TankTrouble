import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPerms'
import copyText from './common/copyText'

export default function directive(app) {
  app.directive('hasRole', hasRole)
  app.directive('hasPermi', hasPermi)
  app.directive('copyText', copyText)
}
