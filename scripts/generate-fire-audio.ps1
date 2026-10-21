$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Speech
$taskRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$taskAudioRoot=[IO.Path]::GetFullPath((Join-Path $taskRoot 'assets/audio/fire'))+[IO.Path]::DirectorySeparatorChar
$taskManifest=Get-Content -LiteralPath (Join-Path $taskRoot 'content/fire-audio.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$taskSpeaker=New-Object System.Speech.Synthesis.SpeechSynthesizer
$taskGenerated=0
try {
 $taskSpeaker.SelectVoice('Microsoft Hanhan Desktop')
 $taskSpeaker.Rate=-1
 foreach($taskLine in $taskManifest.audio.PSObject.Properties){
  $taskDestination=[IO.Path]::GetFullPath((Join-Path $taskRoot $taskLine.Value))
  if(-not $taskDestination.StartsWith($taskAudioRoot,[StringComparison]::OrdinalIgnoreCase) -or [IO.Path]::GetExtension($taskDestination) -ne '.wav'){throw 'Destination must stay in assets/audio/fire/*.wav'}
  if(Test-Path -LiteralPath $taskDestination){continue}
  New-Item -ItemType Directory -Force -Path ([IO.Path]::GetDirectoryName($taskDestination)) | Out-Null
  $taskSpeaker.SetOutputToWaveFile($taskDestination)
  $taskSpeaker.Speak($taskLine.Name)
  $taskSpeaker.SetOutputToNull()
  $taskGenerated++
 }
} finally {$taskSpeaker.Dispose()}
Write-Output "Generated $taskGenerated new fire WAV clips. Existing files preserved."
