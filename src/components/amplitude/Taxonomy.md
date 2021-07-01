# Event Name conventions
[Data Taxonomy Playbook](https://help.amplitude.com/hc/en-us/articles/115000465251-Data-Taxonomy-Playbook)

## Event naming conventions
To ensure we have good metrics please follow these general naming conventions for event name, attribute names:

- Please read the [Data Taxonomy Playbook](https://help.amplitude.com/hc/en-us/articles/115000465251-Data-Taxonomy-Playbook) before creating Event names.

- event names are defined in [eventNames.ts](src/components/amplitude/eventNames.ts)

- event properties names must be in camelCase.

- Enum type values must be in all caps and must not contain non-letter symbols. eg MBR_DEP, MGR_CREATE_SYN

## Logging events example;
```javascript
  import { MBR_DEP_APPROVE_ALLOWANCE } from "@/components/amplitude/eventNames";
  import { amplitudeLogger, Flow } from "@/components/amplitude";

  onClick => {
    amplitudeLogger(MBR_DEP_APPROVE_ALLOWANCE, { flow: Flow.MBR_DEP });
  }
```

## Detailed Event Name definitions
### Approve Deposit Allowance
- flow: MBR_DEP
- trigger: click

## Resources
1. [Dashboard](https://analytics.amplitude.com/syndicate/activity)
2. [Amplitude developers](https://developers.amplitude.com/docs/how-amplitude-works)
3. [Amplitude init options](https://amplitude.github.io/Amplitude-JavaScript/Options#options) option passed when initializing Amplitude eg `require('amplitude-js').getInstance().init(API_KEY, null, {batchEvents: true})`
