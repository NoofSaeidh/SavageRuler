$deployPath = '.\.deploy\'
$deployDistPath = $deployPath + 'wwwroot\'
$vuePath = '.\vue\'
$vueDistPath = $vuePath + 'dist\*'
$hostPath = '.\aspnet-core\src\SavageRuler.Web.Host\'
$hostProjPath = $hostPath + 'SavageRuler.Web.Host.csproj'
$hostPublishPath = $hostPath + 'bin\Release\netcoreapp2.1\publish\*'

dotnet publish $hostProjPath -c Release 
yarn --cwd $vuePath build

Copy-Item $hostPublishPath $deployPath -Force -Recurse
Copy-Item $vueDistPath $deployDistPath -Force -Recurse
