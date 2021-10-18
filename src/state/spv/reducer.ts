import { createReducer } from "@reduxjs/toolkit";

import {
  ActionState,
  ILegalTabMilestone,
  initialState,
  legalTaskIcon,
  Progress,
  SyndicateLegal,
} from "./types";
import {
  setStandaloneFields,
  setSeriesFields,
  setOperatingAgreementFields,
  setDocumentType,
  setEntityName,
  setEntityType,
  setTaskProgress,
  fetchLegalInfo,
  setExistingEntityFields,
  setExistingEntityTaskFields,
} from "./actions";
import _ from "lodash";

export default createReducer(initialState, (builder) => {
  builder
    .addCase(setStandaloneFields, (state, action) => {
      return {
        ...state,
        standaloneLLC: {
          ...state.standaloneLLC,
          [action.payload.field]: action.payload.payload,
        },
      };
    })
    .addCase(setSeriesFields, (state, action) => {
      return {
        ...state,
        seriesLLC: {
          ...state.seriesLLC,
          [action.payload.field]: action.payload.payload,
        },
      };
    })
    .addCase(setDocumentType, (state, action) => {
      return {
        ...state,
        documentType: action.payload,
      };
    })
    .addCase(fetchLegalInfo.fulfilled, (state, action) => {
      const syndicateLegal: SyndicateLegal = _.cloneDeep({
        ...state.syndicateLegal,
        ...action.payload,
      });

      syndicateLegal.milestones.forEach((milestone) => {
        milestone.tasks.forEach((task) => {
          task.icon = legalTaskIcon[task.type];
          task.actionState = ActionState[task.actionState];
        });
        milestone.progressPercentage = 0;
      });

      return {
        ...state,
        syndicateLegal,
      };
    })
    .addCase(fetchLegalInfo.rejected, (state) => {
      return {
        ...state,
        syndicateLegal: {
          ...state.syndicateLegal,
          fetchError: true,
        },
      };
    })
    // TODO: DELETE below Cases author@victor.mutai
    .addCase(setEntityName, (state, action) => {
      return {
        ...state,
        syndicateLegal: {
          ...state.syndicateLegal,
          entityName: action.payload,
        },
      };
    })
    .addCase(setEntityType, (state, action) => {
      return {
        ...state,
        syndicateLegal: {
          ...state.syndicateLegal,
          entityType: action.payload,
        },
      };
    })
    .addCase(setOperatingAgreementFields, (state, action) => {
      return {
        ...state,
        operatingAgreement: {
          ...state.operatingAgreement,
          [action.payload.field]: action.payload.payload,
        },
      };
    })
    .addCase(setExistingEntityFields, (state, action) => {
      return {
        ...state,
        existingEntity: {
          ...state.existingEntity,
          [action.payload.field]: action.payload.payload,
        },
      };
    })
    .addCase(setExistingEntityTaskFields, (state, action) => {
      return {
        ...state,
        existingEntity: {
          ...state.existingEntity,
          taskCompletion: {
            ...state.existingEntity.taskCompletion,
            [action.payload.field]: action.payload.payload,
          }
        },
      };
    })
    .addCase(setTaskProgress, (state, action) => {
      const { progress, milestoneIdx, taskIdx } = action.payload;
      const milestones: ILegalTabMilestone[] = _.cloneDeep(
        state.syndicateLegal.milestones,
      );

      milestones[milestoneIdx].tasks[taskIdx].progress = Progress[progress];

      // Task Ops
      if (milestoneIdx === 0 && taskIdx === 0) {
        switch (Progress[progress]) {
          case Progress.COMPLETED:
            milestones[0].tasks[1].progress = Progress.READY;
            milestones[1].tasks[0].progress = Progress.READY;
            milestones[1].tasks[1].progress = Progress.READY;
            milestones[1].progress = Progress.READY;
            milestones[2].blockingMessage = ActionState.COMING_SOON;
            break;
          case Progress.LOCKED:
            milestones[0].tasks[1].progress = Progress.LOCKED;
            milestones[1].tasks[0].progress = Progress.LOCKED;
            milestones[1].tasks[1].progress = Progress.LOCKED;
            milestones[1].progress = Progress.LOCKED;
            milestones[2].blockingMessage = ActionState.PENDING_FORMATION;
            break;
          case Progress.IN_PROGRESS:
            milestones[0].tasks[1].progress = Progress.READY;
            milestones[1].tasks[0].progress = Progress.LOCKED;
            milestones[1].tasks[1].progress = Progress.LOCKED;
            milestones[1].progress = Progress.LOCKED;
            break;
          default:
            break;
        }
      } else if (milestoneIdx === 0 && taskIdx === 1) {
        switch (Progress[progress]) {
          case Progress.COMPLETED:
            milestones[0].tasks[2].progress = Progress.READY;
            break;
          case Progress.LOCKED:
            milestones[0].tasks[2].progress = Progress.LOCKED;
            break;
          default:
            break;
        }
      } else if (milestoneIdx === 1 && taskIdx === 1) {
        //
        switch (Progress[progress]) {
          case Progress.COMPLETED:
            milestones[1].tasks[2].progress = Progress.READY;
            break;
          case Progress.LOCKED:
            milestones[1].tasks[2].progress = Progress.LOCKED;
            break;
          default:
            break;
        }
      }

      // Milestone Ops
      const inProgress = milestones[milestoneIdx].tasks.filter(
        (t) => t.progress === Progress.COMPLETED,
      );
      const percentage =
        (inProgress.length / milestones[milestoneIdx].tasks.length) * 100;

      milestones[milestoneIdx].progressPercentage = Math.round(percentage);

      if (milestones[milestoneIdx].progressPercentage === 100) {
        milestones[milestoneIdx].progress = Progress.COMPLETED;
      } else if (milestones[milestoneIdx].progressPercentage === 0) {
        milestones[milestoneIdx].progress = Progress.LOCKED;
      } else {
        milestones[milestoneIdx].progress = Progress.IN_PROGRESS;
      }

      return {
        ...state,
        syndicateLegal: {
          ...state.syndicateLegal,
          milestones,
        },
      };
    });
});
