import { Injectable } from '@angular/core';
import { State } from 'src/app/state/types/state';
import { PrimaryScreenStateService } from 'src/app/ui/screens/primary-screen/primary-screen-state.service';
import { Power } from 'src/app/api/entities/powers/types/power';

export class PowersStateService extends PrimaryScreenStateService<Power, number> {}
