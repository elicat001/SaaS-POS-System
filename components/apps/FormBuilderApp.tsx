import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Plus, Edit2, Trash2, Eye, Download, X, Loader2 } from 'lucide-react';
import { appApi } from '../../services/api';
import { useNotification } from '../../contexts/NotificationContext';
import type { FormTemplate, FormSubmission } from '../../types';

const FormBuilderApp: React.FC = () => {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FormTemplate | null>(null);
  const [viewSubmissions, setViewSubmissions] = useState<{ template: FormTemplate | null; submissions: FormSubmission[] }>({
    template: null, submissions: []
  });
  const { success: showSuccess, error: showError } = useNotification();

  // 表单字段
  const [form, setForm] = useState({
    name: '',
    description: '',
    fields: [{ id: '1', type: 'text', label: '', placeholder: '', required: false }] as Array<{
      id: string;
      type: string;
      label: string;
      placeholder?: string;
      required?: boolean;
      options?: string[];
    }>
  });

  const fetchTemplates = async () => {
    try {
      const data = await appApi.listFormTemplates();
      setTemplates(data);
    } catch (e) {
      showError('错误', '获取表单模板失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // 保存模板
  const handleSave = async () => {
    if (!form.name || form.fields.some(f => !f.label)) {
      showError('错误', '请填写完整信息');
      return;
    }
    try {
      if (editingTemplate) {
        await appApi.updateFormTemplate(editingTemplate.id, {
          name: form.name,
          description: form.description,
          fields: form.fields
        });
        showSuccess('成功', '表单模板已更新');
      } else {
        await appApi.createFormTemplate({
          name: form.name,
          description: form.description,
          fields: form.fields
        });
        showSuccess('成功', '表单模板已创建');
      }
      closeForm();
      fetchTemplates();
    } catch (e) {
      showError('错误', '保存失败');
    }
  };

  // 删除模板
  const handleDelete = async (templateId: string) => {
    if (!confirm('确定要删除此表单模板吗？')) return;
    try {
      await appApi.deleteFormTemplate(templateId);
      showSuccess('成功', '表单模板已删除');
      fetchTemplates();
    } catch (e) {
      showError('错误', '删除失败');
    }
  };

  // 查看提交
  const handleViewSubmissions = async (template: FormTemplate) => {
    try {
      const submissions = await appApi.listFormSubmissions(template.id);
      setViewSubmissions({ template, submissions });
    } catch (e) {
      showError('错误', '获取提交数据失败');
    }
  };

  // 添加字段
  const addField = () => {
    setForm({
      ...form,
      fields: [...form.fields, {
        id: Date.now().toString(),
        type: 'text',
        label: '',
        placeholder: '',
        required: false
      }]
    });
  };

  // 删除字段
  const removeField = (fieldId: string) => {
    if (form.fields.length <= 1) return;
    setForm({
      ...form,
      fields: form.fields.filter(f => f.id !== fieldId)
    });
  };

  // 更新字段
  const updateField = (fieldId: string, key: string, value: unknown) => {
    setForm({
      ...form,
      fields: form.fields.map(f => f.id === fieldId ? { ...f, [key]: value } : f)
    });
  };

  const openForm = (template?: FormTemplate) => {
    if (template) {
      setEditingTemplate(template);
      try {
        const fields = JSON.parse(template.fields);
        setForm({
          name: template.name,
          description: template.description || '',
          fields: Array.isArray(fields) ? fields : [{ id: '1', type: 'text', label: '', required: false }]
        });
      } catch {
        setForm({
          name: template.name,
          description: template.description || '',
          fields: [{ id: '1', type: 'text', label: '', required: false }]
        });
      }
    } else {
      setEditingTemplate(null);
      setForm({
        name: '',
        description: '',
        fields: [{ id: '1', type: 'text', label: '', placeholder: '', required: false }]
      });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTemplate(null);
    setForm({
      name: '',
      description: '',
      fields: [{ id: '1', type: 'text', label: '', placeholder: '', required: false }]
    });
  };

  const fieldTypes = [
    { value: 'text', label: '单行文本' },
    { value: 'textarea', label: '多行文本' },
    { value: 'select', label: '下拉选择' },
    { value: 'radio', label: '单选' },
    { value: 'checkbox', label: '多选' },
    { value: 'date', label: '日期' },
    { value: 'phone', label: '手机号' },
    { value: 'email', label: '邮箱' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FileSpreadsheet className="text-green-500" />
          表单工具
        </h1>
        <button
          onClick={() => openForm()}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          创建表单
        </button>
      </div>

      {/* 模板列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.length > 0 ? (
          templates.map(template => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-800">{template.name}</h3>
                  {template.description && (
                    <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  template.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {template.status === 'active' ? '启用中' : '已停用'}
                </span>
              </div>

              <div className="text-sm text-slate-600 mb-4">
                <span className="text-slate-500">提交数: </span>
                <span className="font-medium">{template.submissionCount}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleViewSubmissions(template)}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-1 text-sm"
                >
                  <Eye size={16} />
                  查看数据
                </button>
                <button
                  onClick={() => openForm(template)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            <FileSpreadsheet size={48} className="mx-auto mb-4 opacity-50" />
            <p>暂无表单模板</p>
            <p className="text-sm mt-1">点击上方按钮创建表单</p>
          </div>
        )}
      </div>

      {/* 创建/编辑弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
              <h3 className="font-bold text-lg text-slate-800">
                {editingTemplate ? '编辑表单' : '创建表单'}
              </h3>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">表单名称 *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="如: 客户满意度调查"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="表单描述..."
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-700">表单字段</label>
                  <button
                    onClick={addField}
                    className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    <Plus size={14} />
                    添加字段
                  </button>
                </div>

                <div className="space-y-3">
                  {form.fields.map((field, index) => (
                    <div key={field.id} className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-1">
                          {index + 1}
                        </span>
                        <div className="flex-1 grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs text-slate-500 mb-1 block">字段类型</label>
                            <select
                              value={field.type}
                              onChange={(e) => updateField(field.id, 'type', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded"
                            >
                              {fieldTypes.map(ft => (
                                <option key={ft.value} value={ft.value}>{ft.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-slate-500 mb-1 block">字段名称 *</label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateField(field.id, 'label', e.target.value)}
                              className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded"
                              placeholder="如: 姓名"
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <label className="flex items-center gap-1 text-sm text-slate-600">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                                className="w-4 h-4"
                              />
                              必填
                            </label>
                            {form.fields.length > 1 && (
                              <button
                                onClick={() => removeField(field.id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50 sticky bottom-0">
              <button onClick={closeForm} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
                取消
              </button>
              <button onClick={handleSave} className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 查看提交数据弹窗 */}
      {viewSubmissions.template && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
              <h3 className="font-bold text-lg text-slate-800">
                {viewSubmissions.template.name} - 提交数据
              </h3>
              <button
                onClick={() => setViewSubmissions({ template: null, submissions: [] })}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {viewSubmissions.submissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-slate-600">提交时间</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-600">提交人</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-600">数据</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {viewSubmissions.submissions.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-500">
                            {sub.createdAt ? new Date(sub.createdAt).toLocaleString() : '-'}
                          </td>
                          <td className="px-4 py-3 text-slate-800">
                            {sub.submitterName || sub.submitterPhone || '匿名'}
                          </td>
                          <td className="px-4 py-3">
                            <pre className="text-xs text-slate-600 whitespace-pre-wrap">
                              {sub.data}
                            </pre>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  暂无提交数据
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilderApp;
