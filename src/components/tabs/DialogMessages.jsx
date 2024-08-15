const Report1DialogMessage = () => {

    return (
    <p>Display structured to assist in the creation of the RMF SAP Assessment Methods Tab. </p>
    )
}

const Report2DialogMessage = () => {

  return (
  <p>Displays the average percentages of assessed, submitted, accepted, and rejected by collection.</p>
  )
}

const Report3DialogMessage = () => {

  return (
  <p>Displays Asset count by RMF package acronym ***Excluding DB/Web instances***</p>
  )
}

const Report4DialogMessage = () => {

  return (
  <p>Displays assets by STIG Benchmark Title with the latest version, previous version, and current quarter version </p>
  )
}

const Report5DialogMessage = () => {

  return (
  <p>Displays Open results metrics by eMASS with group ID and STIG Benchmark title </p>
  )
}

const Report6DialogMessage = () => {

  return (
  <p>Displays any checks not updated (import,submitted, or accepted) outside threshold identified by user. </p>
  )
}

const Report7DialogMessage = () => {

  return (
  <p>Displays assets in the NCCM collections but have not been identified in either 3 of the packages (NCCM-NW, NCCM-W, NCCM-S) </p>
  )
}

const Report8DialogMessage = () => {

  return (
  <p>Displays assets by STIG Benchmark Title and if the STIG Benchmark version number has been pinned within the collection </p>
  )
}

const Report9DialogMessage = () => {

  return (
  <p>Displays trend between quarters with the average percentages of assessed, submitted, accepted, and rejected. </p>
  )
}

export {
    Report1DialogMessage,
    Report2DialogMessage,
    Report3DialogMessage,
    Report4DialogMessage,
    Report5DialogMessage,
    Report6DialogMessage,
    Report7DialogMessage,
    Report8DialogMessage,
    Report9DialogMessage
};

