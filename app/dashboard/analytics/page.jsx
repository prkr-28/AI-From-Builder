"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/config";
import { forms, formResponses } from "@/config/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, TrendingUp, Users, Calendar } from "lucide-react";
import moment from "moment";

const AnalyticsPage = () => {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState({
    totalForms: 0,
    totalResponses: 0,
    recentActivity: [],
    topForms: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    user && GetAnalytics();
  }, [user]);

  const GetAnalytics = async () => {
    try {
      // Get all forms by user
      const userForms = await db
        .select()
        .from(forms)
        .where(eq(forms.createdBy, user?.primaryEmailAddress?.emailAddress));

      let totalResponses = 0;
      const topForms = [];
      const recentActivity = [];

      for (const form of userForms) {
        const responses = await db
          .select()
          .from(formResponses)
          .where(eq(formResponses.formId, form.id));
        
        const formData = JSON.parse(form.jsonform);
        totalResponses += responses.length;
        
        topForms.push({
          id: form.id,
          title: formData.formTitle || "Untitled Form",
          responseCount: responses.length,
          createdAt: form.createdAt
        });

        // Add recent responses to activity
        responses.slice(-5).forEach(response => {
          recentActivity.push({
            formTitle: formData.formTitle || "Untitled Form",
            submittedAt: response.submittedAt,
            formId: form.id
          });
        });
      }

      // Sort top forms by response count
      topForms.sort((a, b) => b.responseCount - a.responseCount);
      
      // Sort recent activity by date
      recentActivity.sort((a, b) => moment(b.submittedAt).unix() - moment(a.submittedAt).unix());

      setAnalytics({
        totalForms: userForms.length,
        totalResponses,
        recentActivity: recentActivity.slice(0, 10),
        topForms: topForms.slice(0, 5)
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h2>
        <p className="text-gray-600">Overview of your form performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalForms}</div>
            <p className="text-xs text-muted-foreground">
              Forms created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalResponses}</div>
            <p className="text-xs text-muted-foreground">
              Responses collected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Responses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalForms > 0 ? Math.round(analytics.totalResponses / analytics.totalForms) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Per form
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Forms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Top Performing Forms
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topForms.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No forms created yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.topForms.map((form, index) => (
                  <div key={form.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{form.title}</p>
                      <p className="text-sm text-gray-600">
                        Created {moment(form.createdAt).fromNow()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{form.responseCount}</p>
                      <p className="text-xs text-gray-500">responses</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm">
                        New response for <strong>{activity.formTitle}</strong>
                      </p>
                      <p className="text-xs text-gray-500">
                        {moment(activity.submittedAt).fromNow()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;