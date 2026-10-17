$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Speech
$taskSpeaker=New-Object System.Speech.Synthesis.SpeechSynthesizer
$taskSpeaker.Rate=-2
$taskRoot=(Get-Location).Path
$taskAudioRoot=[IO.Path]::GetFullPath((Join-Path $taskRoot 'assets/audio'))+[IO.Path]::DirectorySeparatorChar
$taskGenerated=0
function Save-TeachingAudio($taskText,$taskFile){
 $taskDestination=[IO.Path]::GetFullPath((Join-Path $taskRoot $taskFile))
 if(-not $taskDestination.StartsWith($taskAudioRoot,[StringComparison]::OrdinalIgnoreCase)){throw 'Audio destination must stay in assets/audio'}
 if(Test-Path -LiteralPath $taskDestination){return}
 New-Item -ItemType Directory -Force -Path ([IO.Path]::GetDirectoryName($taskDestination)) | Out-Null
 if($taskText -match '[\u4e00-\u9fff]'){$taskSpeaker.SelectVoice('Microsoft Hanhan Desktop')}else{$taskSpeaker.SelectVoice('Microsoft Zira Desktop')}
 $taskSpeaker.SetOutputToWaveFile($taskDestination)
 $taskSpeaker.Speak($taskText)
 $taskSpeaker.SetOutputToNull()
 $script:taskGenerated++
}
try{
 $taskManifest=Get-Content content/index.json -Raw | ConvertFrom-Json
 foreach($taskBookFile in $taskManifest.books){
  $taskBook=Get-Content (Join-Path 'content' $taskBookFile) -Raw | ConvertFrom-Json
  foreach($taskUnit in $taskBook.units){foreach($taskLine in $taskUnit.audio.PSObject.Properties){Save-TeachingAudio $taskLine.Name $taskLine.Value}}
 }
 $taskStories=Get-Content content/school-stories.json -Raw | ConvertFrom-Json
 foreach($taskStory in $taskStories.stories){Save-TeachingAudio $taskStory.text $taskStory.audio}
}finally{$taskSpeaker.Dispose()}
Write-Output "Generated $taskGenerated new teaching/story WAV clips."
