import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../../__mocks__/handlersUtils.ts';
import { events } from '../../__mocks__/response/events.json' assert { type: 'json' };
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { server } from '../../setupTests.ts';
import { Event, EventForm } from '../../types.ts';

let onSave = vi.fn();

beforeEach(() => {
  onSave = vi.fn();
});

it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
  setupMockHandlerCreation(events);

  const { result } = renderHook(() => useEventOperations(false));

  await waitFor(() => expect(result.current.events).toEqual(events));
});

it('새로운 이벤트 정보를 입력하면 이벤트가 저장된다.', async () => {
  const newEvent: EventForm = {
    title: '새로운 회의',
    date: '2024-10-16',
    startTime: '09:00',
    endTime: '10:00',
    description: '새로운 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  setupMockHandlerCreation(events);

  const { result } = renderHook(() => useEventOperations(false, onSave));

  act(() => {
    result.current.saveEvent(newEvent);
  });

  await waitFor(() => expect(onSave).toHaveBeenCalledOnce());
});

it('기존 이벤트 정보를 기반으로 적절하게 업데이트를 한다.', async () => {
  const updatedEvent: Event = {
    id: '1',
    title: '기존 회의',
    date: '2024-10-16',
    startTime: '09:00',
    endTime: '10:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  setupMockHandlerUpdating();

  const { result } = renderHook(() => useEventOperations(true, onSave));

  act(() => {
    result.current.saveEvent(updatedEvent);
  });

  await waitFor(() => expect(onSave).toHaveBeenCalledOnce());
});

it("새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 된다", async () => {});

it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {});

it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {});

it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {});

it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {});
