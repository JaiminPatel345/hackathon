// src/redux/slices/resourceSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Resource } from '@/types/resource';
import * as resourceApi from '@/api/resource.api';

interface ResourceState {
  resources: Resource[];
  loading: boolean;
  error: string | null;
}

const initialState: ResourceState = {
  resources: [],
  loading: false,
  error: null,
};

export const fetchResources = createAsyncThunk(
  'resources/fetchResources',
  async () => {
    const response = await resourceApi.getResources();
    return response;
  }
);

export const addResource = createAsyncThunk(
  'resources/addResource',
  async (resourceData: Partial<Resource>) => {
    const formData = new FormData();
    formData.append('title', resourceData.title || '');
    formData.append('type', resourceData.type || '');

    if (resourceData.url) {
      formData.append('url', resourceData.url);
    }

    if (resourceData.fileUri) {
      formData.append('file', {
        uri: resourceData.fileUri,
        name: resourceData.title,
        type: resourceData.type === 'pdf' ? 'application/pdf' : 'image/jpeg',
      } as any);
    }

    const response = await resourceApi.addResource(formData);
    return response;
  }
);

export const deleteResource = createAsyncThunk(
  'resources/deleteResource',
  async (resourceId: string) => {
    await resourceApi.deleteResource(resourceId);
    return resourceId;
  }
);

const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch resources';
      })
      .addCase(addResource.fulfilled, (state, action) => {
        state.resources.push(action.payload);
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.resources = state.resources.filter(
          (resource) => resource.id !== action.payload
        );
      });
  },
});

export default resourceSlice.reducer;