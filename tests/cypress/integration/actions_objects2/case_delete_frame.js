// Copyright (C) 2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

/// <reference types="cypress" />

import { taskName } from '../../support/const';

context('Delete frame from job.', () => {
    let frame;

    before(() => {
        cy.openTaskJob(taskName);
    });

    describe('Tests on th feature with deleting frames.', () => {
        it('Delete frame.', () => {
            cy.get('.cvat-player-frame-selector').within(() => {
                cy.get('[role="spinbutton"]')
                    .should('have.attr', 'aria-valuenow')
                    .then((valueFrameNow) => {
                        frame = Number(valueFrameNow);
                    });
            });
            cy.deleteFrame();
        });

        it('Check frame changed.', () => {
            cy.checkFrameNum(frame + 1);
        });

        it('Check previous frame unavailable.', () => {
            cy.get('.cvat-player-previous-button').click();
            cy.checkFrameNum(frame + 1);
        });

        it('Check open from non-deleted frame', () => {
            cy.visit('/tasks');
            cy.login();
            cy.openTaskJob(taskName);
            cy.checkFrameNum(frame + 1);
        });

        it('Change deleted frame visability.', () => {
            cy.openSettings();
            cy.get('.cvat-workspace-settings-show-deleted').within(() => {
                cy.get('[type="checkbox"]').should('not.be.checked').check();
            });
            cy.closeSettings();
        });

        it('Check previous frame available and deleted.', () => {
            cy.get('.cvat-player-previous-button').click();
            cy.checkFrameNum(frame);
            cy.get('#cvat_canvas_deleted_frame_overlay').should('be.visible');
        });

        it('Check open from deleted frame', () => {
            cy.visit('/tasks');
            cy.login();
            cy.openSettings();
            cy.get('.cvat-workspace-settings-show-deleted').within(() => {
                cy.get('[type="checkbox"]').check();
            });
            cy.closeSettings();
            cy.openTaskJob(taskName);
            cy.checkFrameNum(frame);
            cy.get('#cvat_canvas_deleted_frame_overlay').should('be.visible');
        });

        it('Restore frame.', () => {
            cy.deleteFrame('restore');
            cy.checkFrameNum(frame);
            cy.get('#cvat_canvas_deleted_frame_overlay').should('not.be.visible');
        });
    });
});
