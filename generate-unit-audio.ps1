$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Speech
$taskSpeaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
$taskSpeaker.Rate = -2
$taskCourse = Get-Content -LiteralPath content/my-school.json -Raw | ConvertFrom-Json
foreach($taskUnit in $taskCourse.units | Select-Object -Skip 1){
 foreach($taskLine in $taskUnit.audio.PSObject.Properties){
  $taskDestination=Join-Path (Get-Location) $taskLine.Value
  if(Test-Path -LiteralPath $taskDestination){continue}
  if($taskLine.Name -match '[\u4e00-\u9fff]'){$taskSpeaker.SelectVoice('Microsoft Hanhan Desktop')}else{$taskSpeaker.SelectVoice('Microsoft Zira Desktop')}
  $taskSpeaker.SetOutputToWaveFile($taskDestination)
  $taskSpeaker.Speak($taskLine.Name)
  $taskSpeaker.SetOutputToNull()
 }
}
$taskSpeaker.Dispose()
(Get-ChildItem assets/audio).Count
